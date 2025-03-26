package com.example.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token; // JWT токен
    private String username; // Имя пользователя (опционально)
    // Можно добавить роли, id пользователя и т.д., если нужно на фронтенде
}