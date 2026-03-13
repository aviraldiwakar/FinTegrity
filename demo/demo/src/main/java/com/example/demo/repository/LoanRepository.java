package com.example.demo.repository;

import com.example.demo.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface LoanRepository extends JpaRepository<Loan, Long> {
}
