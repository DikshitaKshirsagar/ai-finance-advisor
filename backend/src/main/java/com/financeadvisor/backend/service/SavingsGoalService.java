package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.AddContributionRequest;
import com.financeadvisor.backend.dto.SavingsGoalRequest;
import com.financeadvisor.backend.dto.SavingsGoalResponse;
import com.financeadvisor.backend.entity.SavingsGoal;
import com.financeadvisor.backend.entity.User;
import com.financeadvisor.backend.repository.SavingsGoalRepository;
import com.financeadvisor.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;

    public SavingsGoalResponse createGoal(String userEmail, SavingsGoalRequest request) {
        User user = getUserByEmail(userEmail);

        SavingsGoal goal = new SavingsGoal();
        goal.setUser(user);
        goal.setGoalName(request.getGoalName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());
        goal.setCurrentAmount(BigDecimal.ZERO);

        SavingsGoal saved = savingsGoalRepository.save(goal);
        return toResponse(saved);
    }

    public List<SavingsGoalResponse> getAllGoals(String userEmail) {
        User user = getUserByEmail(userEmail);
        return savingsGoalRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SavingsGoalResponse addContribution(String userEmail, Long goalId, AddContributionRequest request) {
        User user = getUserByEmail(userEmail);
        SavingsGoal goal = getGoalOwnedByUser(goalId, user);

        goal.setCurrentAmount(goal.getCurrentAmount().add(request.getAmount()));
        goal.setUpdatedAt(java.time.LocalDateTime.now());

        SavingsGoal updated = savingsGoalRepository.save(goal);
        return toResponse(updated);
    }

    public void deleteGoal(String userEmail, Long goalId) {
        User user = getUserByEmail(userEmail);
        SavingsGoal goal = getGoalOwnedByUser(goalId, user);
        savingsGoalRepository.delete(goal);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private SavingsGoal getGoalOwnedByUser(Long goalId, User user) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this savings goal");
        }

        return goal;
    }

    private SavingsGoalResponse toResponse(SavingsGoal goal) {
        BigDecimal progressPercent = BigDecimal.ZERO;

        if (goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            progressPercent = goal.getCurrentAmount()
                    .divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            if (progressPercent.compareTo(BigDecimal.valueOf(100)) > 0) {
                progressPercent = BigDecimal.valueOf(100);
            }
        }

        boolean completed = goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0;

        return new SavingsGoalResponse(
                goal.getId(),
                goal.getGoalName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getTargetDate(),
                progressPercent,
                completed
        );
    }
}