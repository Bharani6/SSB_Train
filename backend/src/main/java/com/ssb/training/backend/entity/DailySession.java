package com.ssb.training.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "daily_sessions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userEmail", "sessionDate"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private LocalDate sessionDate;
    private boolean isActive;
    private String status; // "partial" or "completed"
}
