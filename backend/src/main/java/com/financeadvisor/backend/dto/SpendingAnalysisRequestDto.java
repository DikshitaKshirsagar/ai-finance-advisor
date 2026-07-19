package com.financeadvisor.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpendingAnalysisRequestDto {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private List<CategorySpendDto> categoryBreakdown;
}