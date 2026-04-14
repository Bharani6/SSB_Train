package com.ssb.training.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "session_report")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // In a real prod environment we map this to DailySession
    // But for AI rapid prototyping, we just record the test name and session ID string
    private Long sessionId;

    private String userEmail; // To associate with the logged-in user

    private String testModule; // e.g., SRT, SDT, TAT

    private Integer score; // Score out of 10

    private String dateString; // YYYY-MM-DD
    
    @Column(columnDefinition = "TEXT")
    private String userAnswers; // Store raw JSON string of answers

    @Column(columnDefinition = "TEXT")
    private String psychFeedback;

    @Column(columnDefinition = "TEXT")
    private String gtoFeedback;

    @Column(columnDefinition = "TEXT")
    private String ioFeedback;
}
