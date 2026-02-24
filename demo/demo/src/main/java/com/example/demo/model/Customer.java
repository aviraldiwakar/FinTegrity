package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")

public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String firstName;
    private String lastName;

    @Column(unique=true, nullable=false)
    private String email;

    //datapoints for ml model
    private Integer cibilScore;
    private Double monthlyIncome;

    //constructor
    public Customer(){}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() {return email; }
    public void setEmail(String email) {this.email=email;}

    public Integer getCibilScore() {return cibilScore; }
    public void setCibilScore(Integer cibilScore) {this.cibilScore=cibilScore;}

    public Double getMonthlyIncome() {return monthlyIncome;}
    public void SetMonthlyIncome(Double monthlyIncome) {this.monthlyIncome=monthlyIncome;}
}
