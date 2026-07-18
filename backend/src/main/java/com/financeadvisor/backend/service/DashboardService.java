package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.DashboardResponse;
import com.financeadvisor.backend.entity.User;
import com.financeadvisor.backend.repository.BudgetRepository;
import com.financeadvisor.backend.repository.ExpenseRepository;
import com.financeadvisor.backend.repository.IncomeRepository;
import com.financeadvisor.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard(String userEmail, Integer month, Integer year) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalIncome = incomeRepository.sumByUserAndDateRange(user, startDate, endDate);
        BigDecimal totalExpense = expenseRepository.sumByUserAndDateRange(user, startDate, endDate);
        BigDecimal totalSavings = totalIncome.subtract(totalExpense);

        BigDecimal totalBudgetLimit = budgetRepository.findByUserAndMonthAndYear(user, month, year)
                .stream()
                .map(b -> b.getLimitAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardResponse(
                month,
                year,
                totalIncome,
                totalExpense,
                totalSavings,
                totalBudgetLimit,
                totalExpense
        );
    }
}