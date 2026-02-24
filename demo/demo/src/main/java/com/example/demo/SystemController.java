package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/system")

public class SystemController{
    @GetMapping("/status")
    public String getSystemStatus(){
        return "FinTegrity API is up and running! Ready for ML integration.";
    }
}