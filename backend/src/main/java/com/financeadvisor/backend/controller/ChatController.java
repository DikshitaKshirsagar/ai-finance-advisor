package com.financeadvisor.backend.controller;

import com.financeadvisor.backend.dto.ChatRequest;
import com.financeadvisor.backend.dto.ChatResponse;
import com.financeadvisor.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(Authentication authentication,
                                               @Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.askQuestion(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}