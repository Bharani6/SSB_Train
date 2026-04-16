package com.ssb.training.backend.controller;

import com.ssb.training.backend.entity.CurrentAffair;
import com.ssb.training.backend.service.CurrentAffairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/current-affairs")
public class CurrentAffairController {

    @Autowired
    private CurrentAffairService service;

    @GetMapping
    public List<CurrentAffair> getLast10Days() {
        return service.getLast10DaysRecords();
    }
}
