package com.example.demo.controller;

import com.example.demo.model.Loan;
import com.example.demo.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")

public class LoanController {

    @Autowired
    private LoanService loanService;

    //applying for loan
    @PostMapping("/apply/{customerId}")
    public Loan applyForLoan(@PathVariable Long customerId, @RequestBody Loan loan){
        return loanService.applyForLoan(customerId, loan);
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }
}
