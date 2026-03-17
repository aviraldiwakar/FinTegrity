package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    //tracking date
    private LocalDate dueDate;
    private LocalDate paymentDate;

    //status
    private String status;

    @ManyToOne
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    public Transaction(){
    }

    //to get id
    public Long getId() {
        return id;
    }
    public void setId(Long id) {this.id = id;}

    //to get amount
    public Double getAmount() {
        return amount;
    }
    public void serAmount(Double amount) {
        this.amount = amount;
    }

    //to get duedate
    public LocalDate getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    //to get paymentdate
    public LocalDate getPaymentDate() {
        return paymentDate;
    }
    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    // to get status
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    //to get loan
    public Loan getLoan() {
        return loan;
    }
    public void setLoan(Loan loan) {
        this.loan = loan;
    }
}



