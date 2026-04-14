package com.ssb.training.backend.controller;

import com.ssb.training.backend.entity.SSBQuestion;
import com.ssb.training.backend.repository.SSBQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private SSBQuestionRepository repository;

    @GetMapping("/{type}/{count}")
    public List<SSBQuestion> getRandomQuestions(@PathVariable String type, @PathVariable int count) {
        // type: WAT, SRT, PPDT, TAT
        return repository.findRandomByType(type.toUpperCase(), count);
    }

    @GetMapping("/image/{id}")
    @ResponseBody
    public org.springframework.http.ResponseEntity<byte[]> getQuestionImage(@PathVariable Long id) {
        SSBQuestion q = repository.findById(id).orElseThrow();
        return org.springframework.http.ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.IMAGE_PNG)
                .body(q.getImageData());
    }
}
