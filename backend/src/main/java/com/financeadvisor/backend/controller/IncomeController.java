package com.financeadvisor.backend.controller;

import com.financeadvisor.backend.dto.IncomeRequest;
import com.financeadvisor.backend.dto.IncomeResponse;
import com.financeadvisor.backend.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeResponse> createIncome(Authentication authentication,
                                                          @Valid @RequestBody IncomeRequest request) {
        IncomeResponse response = incomeService.createIncome(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getAllIncomes(Authentication authentication) {
        List<IncomeResponse> incomes = incomeService.getAllIncomes(authentication.getName());
        return ResponseEntity.ok(incomes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(Authentication authentication,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody IncomeRequest request) {
        IncomeResponse response = incomeService.updateIncome(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(Authentication authentication, @PathVariable Long id) {
        incomeService.deleteIncome(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}