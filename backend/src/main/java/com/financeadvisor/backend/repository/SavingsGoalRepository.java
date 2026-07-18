package com.financeadvisor.backend.repository;

import com.financeadvisor.backend.entity.SavingsGoal;
import com.financeadvisor.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUserOrderByCreatedAtDesc(User user);
}