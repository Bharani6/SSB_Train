package com.ssb.training.backend.repository;

import com.ssb.training.backend.entity.SSBQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SSBQuestionRepository extends JpaRepository<SSBQuestion, Long> {
    
    @Query(value = "SELECT * FROM ssb_questions WHERE type = :type ORDER BY RANDOM() LIMIT :count", nativeQuery = true)
    List<SSBQuestion> findRandomByType(String type, int count);
    
    long countByType(String type);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM SSBQuestion q WHERE q.type = :type")
    void deleteByType(String type);
}
