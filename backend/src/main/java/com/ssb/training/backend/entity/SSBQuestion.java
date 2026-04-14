package com.ssb.training.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ssb_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SSBQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // WAT, SRT, PPDT, TAT, etc.

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // The word or the situation

    @Lob
    @Column(name = "image_data", length = 10000000)
    private byte[] imageData;

    private String category; // e.g., "Positive", "Conflict", "Social"
}
