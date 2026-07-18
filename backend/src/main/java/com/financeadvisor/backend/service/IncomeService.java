package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.IncomeRequest;
import com.financeadvisor.backend.dto.IncomeResponse;
import com.financeadvisor.backend.entity.Income;
import com.financeadvisor.backend.entity.User;
import com.financeadvisor.backend.repository.IncomeRepository;
import com.financeadvisor.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeResponse createIncome(String userEmail, IncomeRequest request) {
        User user = getUserByEmail(userEmail);

        Income income = new Income();
        income.setUser(user);
        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setDescription(request.getDescription());
        income.setIncomeDate(request.getIncomeDate());

        Income saved = incomeRepository.save(income);
        return toResponse(saved);
    }

    public List<IncomeResponse> getAllIncomes(String userEmail) {
        User user = getUserByEmail(userEmail);
        return incomeRepository.findByUserOrderByIncomeDateDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public IncomeResponse updateIncome(String userEmail, Long incomeId, IncomeRequest request) {
        User user = getUserByEmail(userEmail);
        Income income = getIncomeOwnedByUser(incomeId, user);

        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setDescription(request.getDescription());
        income.setIncomeDate(request.getIncomeDate());
        income.setUpdatedAt(java.time.LocalDateTime.now());

        Income updated = incomeRepository.save(income);
        return toResponse(updated);
    }

    public void deleteIncome(String userEmail, Long incomeId) {
        User user = getUserByEmail(userEmail);
        Income income = getIncomeOwnedByUser(incomeId, user);
        incomeRepository.delete(income);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Income getIncomeOwnedByUser(Long incomeId, User user) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this income");
        }

        return income;
    }

    private IncomeResponse toResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getSource(),
                income.getAmount(),
                income.getDescription(),
                income.getIncomeDate(),
                income.getCreatedAt()
        );
    }
}