package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.*;
import com.financeadvisor.backend.entity.User;
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
public class ChatService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final RestClient aiServiceRestClient;

    public ChatResponse askQuestion(String userEmail, ChatRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        YearMonth yearMonth = YearMonth.now();
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalIncome = incomeRepository.sumByUserAndDateRange(user, startDate, endDate);
        BigDecimal totalExpense = expenseRepository.sumByUserAndDateRange(user, startDate, endDate);
        BigDecimal totalSavings = totalIncome.subtract(totalExpense);

        List<CategorySpendDto> categoryBreakdown = expenseRepository.findByUserOrderByExpenseDateDesc(user)
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

        ChatAiRequestDto aiRequest = new ChatAiRequestDto();
        aiRequest.setQuestion(request.getQuestion());
        aiRequest.setTotalIncome(totalIncome);
        aiRequest.setTotalExpense(totalExpense);
        aiRequest.setTotalSavings(totalSavings);
        aiRequest.setCategoryBreakdown(categoryBreakdown);

        try {
            ChatResponse response = aiServiceRestClient.post()
                    .uri("/chat")
                    .body(aiRequest)
                    .retrieve()
                    .body(ChatResponse.class);

            if (response == null || response.getAnswer() == null) {
                return fallback();
            }

            return response;
        } catch (Exception ex) {
            return fallback();
        }
    }

    private ChatResponse fallback() {
        ChatResponse response = new ChatResponse();
        response.setAnswer("Sorry, I'm having trouble answering right now. Please try again in a moment.");
        return response;
    }
}