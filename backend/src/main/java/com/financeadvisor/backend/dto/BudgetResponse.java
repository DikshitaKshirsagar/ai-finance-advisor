package com.financeadvisor.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {

    private Long id;
    private String category;
    private BigDecimal limitAmount;
    private Integer month;
    private Integer year;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private boolean overBudget;
}