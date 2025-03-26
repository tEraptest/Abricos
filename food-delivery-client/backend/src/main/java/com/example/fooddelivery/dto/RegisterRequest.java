package com.example.fooddelivery.dto;

import jakarta.validation.constraints.Email; // Для валидации email
import jakarta.validation.constraints.NotBlank; // Поле не должно быть пустым
import jakarta.validation.constraints.Size; // Ограничение размера
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Имя пользователя не может быть пустым")
    @Size(min = 3, max = 50, message = "Имя пользователя должно содержать от 3 до 50 символов")
    private String username;

    @NotBlank(message = "Email не может быть пустым")
    @Email(message = "Некорректный формат email")
    @Size(max = 100, message = "Email не должен превышать 100 символов")
    private String email;

    @NotBlank(message = "Пароль не может быть пустым")
    @Size(min = 6, max = 120, message = "Пароль должен содержать от 6 до 120 символов")
    private String password;

    // Опционально: можно добавить поля firstName, lastName, если хочешь их при регистрации
    private String firstName;
    private String lastName;
}