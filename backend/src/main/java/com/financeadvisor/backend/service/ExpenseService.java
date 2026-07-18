package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.ExpenseRequest;
import com.financeadvisor.backend.dto.ExpenseResponse;
import com.financeadvisor.backend.entity.Expense;
import com.financeadvisor.backend.entity.User;
import com.financeadvisor.backend.repository.ExpenseRepository;
import com.financeadvisor.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseResponse createExpense(String userEmail, ExpenseRequest request) {
        User user = getUserByEmail(userEmail);

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    public List<ExpenseResponse> getAllExpenses(String userEmail) {
        User user = getUserByEmail(userEmail);
        return expenseRepository.findByUserOrderByExpenseDateDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse updateExpense(String userEmail, Long expenseId, ExpenseRequest request) {
        User user = getUserByEmail(userEmail);
        Expense expense = getExpenseOwnedByUser(expenseId, user);

        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setUpdatedAt(java.time.LocalDateTime.now());

        Expense updated = expenseRepository.save(expense);
        return toResponse(updated);
    }

    public void deleteExpense(String userEmail, Long expenseId) {
        User user = getUserByEmail(userEmail);
        Expense expense = getExpenseOwnedByUser(expenseId, user);
        expenseRepository.delete(expense);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Expense getExpenseOwnedByUser(Long expenseId, User user) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this expense");
        }

        return expense;
    }

    private ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getDescription(),
                expense.getExpenseDate(),
                expense.getCreatedAt()
        );
    }
}