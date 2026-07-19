package com.financeadvisor.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class InsightResponse {
    private List<InsightItem> insights;
}