package com.example.demo.service;

import com.example.demo.model.Customer;
import com.example.demo.model.Loan;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LoanService {
    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private CustomerRepository customerRepository;

    //to apply for loan
    public Loan applyForLoan(Long customerId, Loan loan) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found" + customerId));

        //attach customer to loan
        loan.setCustomer(customer);

        //default status for model
        loan.setLoanStatus("Pending");

        return loanRepository.save(loan);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }
}
