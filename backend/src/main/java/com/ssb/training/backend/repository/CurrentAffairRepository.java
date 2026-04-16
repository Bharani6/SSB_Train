package com.ssb.training.backend.repository;

import com.ssb.training.backend.entity.CurrentAffair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CurrentAffairRepository extends JpaRepository<CurrentAffair, Long> {
    List<CurrentAffair> findByDateBetweenOrderByDateDesc(LocalDate startDate, LocalDate endDate);
    List<CurrentAffair> findByCategoryOrderByDateDesc(String category);
}
