package com.yourteam.dogfood.service;

import org.springframework.stereotype.Service;

@Service
public class DogfoodService {

    public String getStatus() {
        return "Dogfood service is running";
    }
}
