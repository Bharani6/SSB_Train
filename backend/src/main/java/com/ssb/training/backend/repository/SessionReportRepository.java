package com.ssb.training.backend.repository;

import com.ssb.training.backend.entity.SessionReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionReportRepository extends JpaRepository<SessionReport, Long> {
    List<SessionReport> findByDateString(String dateString);
    List<SessionReport> findByUserEmail(String userEmail);
    List<SessionReport> findByUserEmailAndDateString(String userEmail, String dateString);
}
