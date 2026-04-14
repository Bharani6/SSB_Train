package com.ssb.training.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "oir_result")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OirResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private DailySession session;

    private Integer score;

    private Integer timeTaken; // in seconds
}
