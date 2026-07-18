package com.financeadvisor.backend.controller;

import com.financeadvisor.backend.dto.ExpenseRequest;
import com.financeadvisor.backend.dto.ExpenseResponse;
import com.financeadvisor.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(Authentication authentication,
                                                            @Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.createExpense(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(Authentication authentication) {
        List<ExpenseResponse> expenses = expenseService.getAllExpenses(authentication.getName());
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(Authentication authentication,
                                                           @PathVariable Long id,
                                                           @Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.updateExpense(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(Authentication authentication, @PathVariable Long id) {
        expenseService.deleteExpense(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}