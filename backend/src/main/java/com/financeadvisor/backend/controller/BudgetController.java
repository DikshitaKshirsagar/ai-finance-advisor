package com.financeadvisor.backend.controller;

import com.financeadvisor.backend.dto.BudgetRequest;
import com.financeadvisor.backend.dto.BudgetResponse;
import com.financeadvisor.backend.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(Authentication authentication,
                                                          @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.createBudget(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(Authentication authentication,
                                                              @RequestParam Integer month,
                                                              @RequestParam Integer year) {
        List<BudgetResponse> budgets = budgetService.getBudgetsForMonth(authentication.getName(), month, year);
        return ResponseEntity.ok(budgets);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(Authentication authentication,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.updateBudget(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(Authentication authentication, @PathVariable Long id) {
        budgetService.deleteBudget(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}