package com.financeadvisor.backend.controller;

import com.financeadvisor.backend.dto.DashboardResponse;
import com.financeadvisor.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication,
                                                             @RequestParam Integer month,
                                                             @RequestParam Integer year) {
        DashboardResponse response = dashboardService.getDashboard(authentication.getName(), month, year);
        return ResponseEntity.ok(response);
    }
}