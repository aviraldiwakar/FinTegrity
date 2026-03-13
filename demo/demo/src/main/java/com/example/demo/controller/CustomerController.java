package com.example.demo.controller;

import com.example.demo.model.Customer;
import com.example.demo.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")

public class CustomerController {
    @Autowired
    private CustomerService customerService;

    //listen post request at /api/v1/customers
    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer){
        return customerService.createCustomer(customer);
    }

    //listen get request to retrieve customer
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomer();
    }
}
