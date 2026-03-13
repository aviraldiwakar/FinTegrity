package com.example.demo.service;

import com.example.demo.model.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    //takes objects and save
    public Customer createCustomer(Customer customer){
        return customerRepository.save(customer);
    }

    //retrieve all customers
    public List<Customer> getAllCustomer() {
        return customerRepository.findAll();
    }
}
