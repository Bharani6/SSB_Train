package com.ssb.training.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wat_response")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private DailySession session;

    private String word;

    private String response;

    private Integer timeTaken; // in seconds
}
