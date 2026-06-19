package com.fintegrity.controller;

import com.fintegrity.model.EMI;
import com.fintegrity.repository.EMIRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emis")
@CrossOrigin(origins = "*")
public class EMIController {

    private final EMIRepository emiRepository;

    @Autowired
    public EMIController(EMIRepository emiRepository) {
        this.emiRepository = emiRepository;
    }

    @GetMapping
    public ResponseEntity<List<EMI>> getAllEmis() {
        return ResponseEntity.ok(emiRepository.findAll());
    }

    @GetMapping("/by-loan/{loanId}")
    public ResponseEntity<List<EMI>> getEmisByLoan(@PathVariable Long loanId) {
        return ResponseEntity.ok(emiRepository.findByLoanId(loanId));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payEmi(@PathVariable Long id) {
        EMI emi = emiRepository.findById(id).orElse(null);
        if (emi == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "EMI record not found."));
        }

        if ("PAID".equalsIgnoreCase(emi.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "This EMI has already been paid successfully."));
        }

        emi.setStatus("PAID");
        emi.setPaymentDate(LocalDate.now());
        EMI updatedEmi = emiRepository.save(emi);

        return ResponseEntity.ok(updatedEmi);
    }

    @PostMapping("/{id}/trigger-late")
    public ResponseEntity<?> markEmiLate(@PathVariable Long id) {
        EMI emi = emiRepository.findById(id).orElse(null);
        if (emi == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "EMI installment not detected."));
        }

        emi.setStatus("LATE");
        EMI updatedEmi = emiRepository.save(emi);

        return ResponseEntity.ok(updatedEmi);
    }
}
