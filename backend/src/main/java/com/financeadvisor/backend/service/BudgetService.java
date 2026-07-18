package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.BudgetRequest;
import com.financeadvisor.backend.dto.BudgetResponse;
import com.financeadvisor.backend.entity.Budget;
import com.financeadvisor.backend.entity.User;
import com.financeadvisor.backend.repository.BudgetRepository;
import com.financeadvisor.backend.repository.ExpenseRepository;
import com.financeadvisor.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public BudgetResponse createBudget(String userEmail, BudgetRequest request) {
        User user = getUserByEmail(userEmail);

        budgetRepository.findByUserAndCategoryAndMonthAndYear(
                user, request.getCategory(), request.getMonth(), request.getYear()
        ).ifPresent(b -> {
            throw new RuntimeException("Budget for this category and month already exists");
        });

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        Budget saved = budgetRepository.save(budget);
        return toResponse(saved);
    }

    public List<BudgetResponse> getBudgetsForMonth(String userEmail, Integer month, Integer year) {
        User user = getUserByEmail(userEmail);
        return budgetRepository.findByUserAndMonthAndYear(user, month, year)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BudgetResponse updateBudget(String userEmail, Long budgetId, BudgetRequest request) {
        User user = getUserByEmail(userEmail);
        Budget budget = getBudgetOwnedByUser(budgetId, user);

        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setUpdatedAt(java.time.LocalDateTime.now());

        Budget updated = budgetRepository.save(budget);
        return toResponse(updated);
    }

    public void deleteBudget(String userEmail, Long budgetId) {
        User user = getUserByEmail(userEmail);
        Budget budget = getBudgetOwnedByUser(budgetId, user);
        budgetRepository.delete(budget);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Budget getBudgetOwnedByUser(Long budgetId, User user) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this budget");
        }

        return budget;
    }

    private BudgetResponse toResponse(Budget budget) {
        YearMonth yearMonth = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal spent = expenseRepository.sumByUserAndCategoryAndDateRange(
                budget.getUser(), budget.getCategory(), startDate, endDate
        );

        BigDecimal remaining = budget.getLimitAmount().subtract(spent);
        boolean isOverBudget = spent.compareTo(budget.getLimitAmount()) > 0;

        return new BudgetResponse(
                budget.getId(),
                budget.getCategory(),
                budget.getLimitAmount(),
                budget.getMonth(),
                budget.getYear(),
                spent,
                remaining,
                isOverBudget
        );
    }
}