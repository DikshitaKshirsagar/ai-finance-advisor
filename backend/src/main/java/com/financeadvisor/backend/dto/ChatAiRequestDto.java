package com.financeadvisor.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ChatAiRequestDto {
    private String question;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal totalSavings;
    private List<CategorySpendDto> categoryBreakdown;
}