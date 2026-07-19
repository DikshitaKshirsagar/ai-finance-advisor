package com.financeadvisor.backend.dto;

import lombok.Data;

@Data
public class InsightItem {
    private String type;
    private String title;
    private String message;
}