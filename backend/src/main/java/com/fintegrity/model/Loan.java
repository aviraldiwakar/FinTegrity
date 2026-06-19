package com.fintegrity.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "loan_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "emi_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal emiAmount;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "loan_status", nullable = false, length = 20)
    private String loanStatus = "PENDING";

    @Column(name = "originated_at", insertable = false, updatable = false)
    private LocalDateTime originatedAt;

    // Constructors
    public Loan() {}

    public Loan(Customer customer, BigDecimal loanAmount, BigDecimal emiAmount, Integer tenureMonths, String loanStatus) {
        this.customer = customer;
        this.loanAmount = loanAmount;
        this.emiAmount = emiAmount;
        this.tenureMonths = tenureMonths;
        this.loanStatus = loanStatus;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public BigDecimal getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(BigDecimal emiAmount) {
        this.emiAmount = emiAmount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public String getLoanStatus() {
        return loanStatus;
    }

    public void setLoanStatus(String loanStatus) {
        this.loanStatus = loanStatus;
    }

    public LocalDateTime getOriginatedAt() {
        return originatedAt;
    }

    public void setOriginatedAt(LocalDateTime originatedAt) {
        this.originatedAt = originatedAt;
    }
}
