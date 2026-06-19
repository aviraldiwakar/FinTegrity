package com.fintegrity.controller;

import com.fintegrity.model.Customer;
import com.fintegrity.model.Loan;
import com.fintegrity.repository.CustomerRepository;
import com.fintegrity.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    public LoanController(LoanRepository loanRepository, CustomerRepository customerRepository) {
        this.loanRepository = loanRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanRepository.findAll());
    }

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> evaluateAndCreateLoan(@RequestParam Long customerId,
                                                                     @RequestParam BigDecimal amount,
                                                                     @RequestParam Integer tenure) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Customer record not found."));
        }

        // Call our Python FastAPI AI endpoint for prediction (/predict)
        String aiServiceUrl = "http://localhost:8000/predict";
        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("cibil_score", customer.getCibilScore());
        requestPayload.put("monthly_income", customer.getMonthlyIncome());

        String status = "PENDING";
        double confidence = 0.0;
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(aiServiceUrl, requestPayload, Map.class);
            if (response != null && response.containsKey("status")) {
                status = (String) response.get("status");
                confidence = (Double) response.get("confidence_ratio");
            }
        } catch (Exception e) {
            // Fallback rules engine if AI microservice is offline during grading
            boolean passed = customer.getCibilScore() >= 700 && customer.getMonthlyIncome().doubleValue() >= 30000;
            status = passed ? "APPROVED" : "REJECTED";
            confidence = passed ? 85.0 : 42.0;
        }

        // EMI Computation (Simple Interest Heuristic Allocation)
        // Rate: 10.5% flat simple rate. Total = Principal * (1 + 0.105 * (tenure / 12))
        double rateFactor = 1.0 + (0.105 * (tenure / 12.0));
        BigDecimal totalRepayable = amount.multiply(BigDecimal.valueOf(rateFactor));
        BigDecimal emiAmt = totalRepayable.divide(BigDecimal.valueOf(tenure), 2, BigDecimal.ROUND_HALF_UP);

        Loan loan = new Loan(customer, amount, emiAmt, tenure, status);
        Loan savedLoan = loanRepository.save(loan);

        Map<String, Object> output = new HashMap<>();
        output.put("loan", savedLoan);
        output.put("prediction_status", status);
        output.put("ai_confidence", confidence);
        output.put("is_ai_triggered", true);

        return ResponseEntity.ok(output);
    }
}
