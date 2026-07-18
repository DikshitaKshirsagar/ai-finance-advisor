package com.financeadvisor.backend.repository;

import com.financeadvisor.backend.entity.Expense;
import com.financeadvisor.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByExpenseDateDesc(User user);

    List<Expense> findByUserAndCategoryOrderByExpenseDateDesc(User user, String category);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.user = :user AND e.category = :category " +
           "AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndCategoryAndDateRange(@Param("user") User user,
                                                  @Param("category") String category,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.user = :user AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndDateRange(@Param("user") User user,
                                       @Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);
}