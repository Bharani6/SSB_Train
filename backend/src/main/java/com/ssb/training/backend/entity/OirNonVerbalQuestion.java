package com.ssb.training.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "oir_nonverbal_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OirNonVerbalQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionData; // Image URL or Base64

    @Column(columnDefinition = "TEXT")
    private String optionA; // Image URL or Text

    @Column(columnDefinition = "TEXT")
    private String optionB;

    @Column(columnDefinition = "TEXT")
    private String optionC;

    @Column(columnDefinition = "TEXT")
    private String optionD;

    @Column(length = 2, nullable = false)
    private String correctAnswer;

    private LocalDateTime createdAt = LocalDateTime.now();
}
