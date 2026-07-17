package com.financeadvisor.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private Long userId;
    private String email;
    private String fullName;
    private String token;
}