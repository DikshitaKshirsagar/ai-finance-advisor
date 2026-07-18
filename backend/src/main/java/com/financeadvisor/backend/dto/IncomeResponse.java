package com.financeadvisor.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncomeResponse {

    private Long id;
    private String source;
    private BigDecimal amount;
    private String description;
    private LocalDate incomeDate;
    private LocalDateTime createdAt;
}