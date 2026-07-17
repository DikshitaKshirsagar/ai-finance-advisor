package com.financeadvisor.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private boolean isVerified;
    private LocalDateTime createdAt;
}