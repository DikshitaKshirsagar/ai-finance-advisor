package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.*;
import com.financeadvisor.backend.entity.User;
import com.financeadvisor.backend.repository.BudgetRepository;
import com.financeadvisor.backend.repository.ExpenseRepository;
import com.financeadvisor.backend.repository.IncomeRepository;
import com.financeadvisor.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final RestClient aiServiceRestClient;

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

    public CategoryBreakdownResponse getCategoryBreakdown(String userEmail, Integer month, Integer year) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<CategorySpendDto> categoryBreakdown = buildCategoryBreakdown(user, startDate, endDate);

        CategoryBreakdownResponse response = new CategoryBreakdownResponse();
        response.setCategories(categoryBreakdown);
        return response;
    }

    public InsightResponse getInsight(String userEmail, Integer month, Integer year) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalIncome = incomeRepository.sumByUserAndDateRange(user, startDate, endDate);
        BigDecimal totalExpense = expenseRepository.sumByUserAndDateRange(user, startDate, endDate);

        List<CategorySpendDto> categoryBreakdown = buildCategoryBreakdown(user, startDate, endDate);

        SpendingAnalysisRequestDto requestDto = new SpendingAnalysisRequestDto(
                totalIncome, totalExpense, categoryBreakdown
        );

        try {
            InsightResponse response = aiServiceRestClient.post()
                    .uri("/analyze-spending")
                    .body(requestDto)
                    .retrieve()
                    .body(InsightResponse.class);

            if (response == null || response.getInsights() == null || response.getInsights().isEmpty()) {
                return fallbackInsight();
            }

            return response;
        } catch (Exception ex) {
            return fallbackInsight();
        }
    }

    private List<CategorySpendDto> buildCategoryBreakdown(User user, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserOrderByExpenseDateDesc(user)
                .stream()
                .filter(e -> !e.getExpenseDate().isBefore(startDate) && !e.getExpenseDate().isAfter(endDate))
                .collect(Collectors.groupingBy(
                        e -> e.getCategory(),
                        Collectors.reducing(BigDecimal.ZERO, e -> e.getAmount(), BigDecimal::add)
                ))
                .entrySet()
                .stream()
                .map(entry -> new CategorySpendDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private InsightResponse fallbackInsight() {
        InsightResponse fallback = new InsightResponse();
        InsightItem item = new InsightItem();
        item.setType("tip");
        item.setTitle("Insights Unavailable");
        item.setMessage("AI insights are temporarily unavailable. Please try again shortly.");
        fallback.setInsights(List.of(item));
        return fallback;
    }
}