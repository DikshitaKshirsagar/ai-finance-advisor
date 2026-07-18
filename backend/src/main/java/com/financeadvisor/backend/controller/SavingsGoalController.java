package com.financeadvisor.backend.controller;

import com.financeadvisor.backend.dto.AddContributionRequest;
import com.financeadvisor.backend.dto.SavingsGoalRequest;
import com.financeadvisor.backend.dto.SavingsGoalResponse;
import com.financeadvisor.backend.service.SavingsGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    @PostMapping
    public ResponseEntity<SavingsGoalResponse> createGoal(Authentication authentication,
                                                             @Valid @RequestBody SavingsGoalRequest request) {
        SavingsGoalResponse response = savingsGoalService.createGoal(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoalResponse>> getAllGoals(Authentication authentication) {
        List<SavingsGoalResponse> goals = savingsGoalService.getAllGoals(authentication.getName());
        return ResponseEntity.ok(goals);
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<SavingsGoalResponse> addContribution(Authentication authentication,
                                                                  @PathVariable Long id,
                                                                  @Valid @RequestBody AddContributionRequest request) {
        SavingsGoalResponse response = savingsGoalService.addContribution(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(Authentication authentication, @PathVariable Long id) {
        savingsGoalService.deleteGoal(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}