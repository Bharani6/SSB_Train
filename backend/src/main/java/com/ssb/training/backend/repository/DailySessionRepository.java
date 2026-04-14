package com.ssb.training.backend.repository;

import com.ssb.training.backend.entity.DailySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailySessionRepository extends JpaRepository<DailySession, Long> {
    Optional<DailySession> findByUserEmailAndSessionDate(String userEmail, LocalDate sessionDate);
    List<DailySession> findByUserEmailOrderBySessionDateDesc(String userEmail);
    long countByUserEmailAndIsActiveTrue(String userEmail);
}
