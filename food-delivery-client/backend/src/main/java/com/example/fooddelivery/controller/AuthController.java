package com.example.fooddelivery.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; // Для включения валидации DTO
import org.springframework.web.bind.annotation.RestController;

import com.example.fooddelivery.dto.AuthResponse; // Для кодов ответа
import com.example.fooddelivery.dto.LoginRequest;
import com.example.fooddelivery.dto.RegisterRequest;
import com.example.fooddelivery.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController // Помечаем как REST контроллер
@RequestMapping("/api/auth") // Базовый путь для всех эндпоинтов этого контроллера
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000") // Раскомментируй и настрой CORS, если нужно для разработки
public class AuthController {

    private final AuthService authService;

    // Эндпоинт для регистрации нового пользователя
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // Используем try-catch для перехвата ошибок (например, если юзер уже существует)
        try {
            AuthResponse response = authService.register(registerRequest);
            // Возвращаем токен и статус 201 Created
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Если возникла ошибка (например, имя занято), возвращаем 400 Bad Request с сообщением
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage()); // Возвращаем сообщение об ошибке
        } catch (Exception e) {
            // Обработка других непредвиденных ошибок
             return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Произошла ошибка при регистрации.");
        }
    }

    // Эндпоинт для входа пользователя
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            // Возвращаем токен и статус 200 OK
            return ResponseEntity.ok(response);
        } catch (Exception e) { // Ловим исключения аутентификации (BadCredentialsException и др.)
            // Возвращаем 401 Unauthorized
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Ошибка аутентификации: неверное имя пользователя или пароль.");
        }
    }
}