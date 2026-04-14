package com.ssb.training.backend.controller;

import com.ssb.training.backend.entity.SessionReport;
import com.ssb.training.backend.entity.DailySession;
import com.ssb.training.backend.repository.SessionReportRepository;
import com.ssb.training.backend.repository.DailySessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    @Autowired
    private SessionReportRepository repository;
    
    @Autowired
    private DailySessionRepository sessionRepository;

    private static final Logger logger = LoggerFactory.getLogger(EvaluationController.class);

    @PostMapping("/submit")
    public ResponseEntity<SessionReport> submitEvaluation(@RequestBody SessionReport report) {
        logger.info("🔥 Received New AI Evaluation Score: {}/10 for user: {}", report.getScore(), report.getUserEmail());
        
        // 1. Mark session as active
        LocalDate today = LocalDate.now();
        Optional<DailySession> sessionOpt = sessionRepository.findByUserEmailAndSessionDate(report.getUserEmail(), today);
        DailySession session;
        if (sessionOpt.isPresent()) {
            session = sessionOpt.get();
        } else {
            session = new DailySession();
            session.setUserEmail(report.getUserEmail());
            session.setSessionDate(today);
        }
        session.setActive(true);
        session.setStatus("completed");
        sessionRepository.save(session);

        // 2. Save the report
        SessionReport saved = repository.save(report);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/dashboard/{email:.+}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> getDashboardData(@PathVariable String email) {
        logger.info("📊 DASHBOARD REQUEST :: Fetching stats for {}", email);

        // Calculate consecutive streak from unique active session dates
        List<LocalDate> trainingDates = sessionRepository.findByUserEmailOrderBySessionDateDesc(email)
            .stream()
            .filter(DailySession::isActive)
            .map(DailySession::getSessionDate)
            .distinct() // Handle multiple sessions on same day
            .collect(Collectors.toList());
        
        logger.debug("Found {} unique active training days.", trainingDates.size());

        long streak = 0;
        if (!trainingDates.isEmpty()) {
            LocalDate today = LocalDate.now();
            LocalDate yesterday = today.minusDays(1);
            LocalDate latestSessionDate = trainingDates.get(0);
            
            // Streak only continues if they trained today OR yesterday
            if (latestSessionDate.equals(today) || latestSessionDate.equals(yesterday)) {
                streak = 1;
                LocalDate expectedPrevDate = latestSessionDate.minusDays(1);
                
                for (int i = 1; i < trainingDates.size(); i++) {
                    LocalDate actualDate = trainingDates.get(i);
                    if (actualDate.equals(expectedPrevDate)) {
                        streak++;
                        expectedPrevDate = expectedPrevDate.minusDays(1);
                    } else {
                        // Gap found, streak ends here
                        break;
                    }
                }
            } else {
                logger.warn("Streak broken. Latest training was {} (not today/yesterday)", latestSessionDate);
            }
        }
        
        logger.info("FINAL STREAK :: {}", streak);

        List<SessionReport> reports = repository.findByUserEmail(email);
        long testsLogged = reports.size();
        
        Double avgScore = reports.stream()
            .mapToInt(SessionReport::getScore)
            .average()
            .orElse(0.0);

        List<String> activeDates = trainingDates.stream()
            .map(LocalDate::toString)
            .collect(Collectors.toList());

        System.out.println("DEBUG :: Tests Logged: " + testsLogged + ", Avg Score: " + avgScore);

        return ResponseEntity.ok(Map.of(
            "active_days", trainingDates.size(), // Total unique days trained
            "streak", streak,                   // Current consecutive streak
            "tests_logged", testsLogged,
            "avg_score", Math.round(avgScore * 10.0) / 10.0,
            "active_dates", activeDates,
            "success", true
        ));
    }

    @GetMapping("/user/{email:.+}")
    public ResponseEntity<List<SessionReport>> getUserEvaluations(@PathVariable String email) {
        return ResponseEntity.ok(repository.findByUserEmail(email));
    }

    @GetMapping("/{email:.+}/ping")
    public ResponseEntity<Void> pingActive(@PathVariable String email) {
        LocalDate today = LocalDate.now();
        Optional<DailySession> sessionOpt = sessionRepository.findByUserEmailAndSessionDate(email, today);
        DailySession session;
        if (sessionOpt.isPresent()) {
            session = sessionOpt.get();
        } else {
            session = new DailySession();
            session.setUserEmail(email);
            session.setSessionDate(today);
        }
        session.setActive(true);
        sessionRepository.save(session);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{email:.+}/date/{date}")
    public ResponseEntity<List<SessionReport>> getUserEvaluationsByDate(@PathVariable String email, @PathVariable String date) {
        return ResponseEntity.ok(repository.findByUserEmailAndDateString(email, date));
    }

    @GetMapping
    public ResponseEntity<Iterable<SessionReport>> getAllEvaluations() {
        return ResponseEntity.ok(repository.findAll());
    }
}
