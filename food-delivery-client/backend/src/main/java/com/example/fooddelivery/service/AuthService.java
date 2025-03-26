package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.AuthResponse;
import com.example.fooddelivery.dto.LoginRequest;
import com.example.fooddelivery.dto.RegisterRequest;
import com.example.fooddelivery.model.Role;
import com.example.fooddelivery.model.User;
import com.example.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Используем для login
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Для управления транзакциями

import java.util.Set; // Для добавления роли

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional // Метод регистрации выполняется в транзакции
    public AuthResponse register(RegisterRequest request) {
        // 1. Проверяем, не занято ли имя пользователя или email
        if (userRepository.existsByUsername(request.getUsername())) {
            // Можно выбросить кастомное исключение или вернуть ошибку
            throw new IllegalArgumentException("Ошибка: Имя пользователя уже занято!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ошибка: Email уже используется!");
        }

        // 2. Создаем нового пользователя
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Хешируем пароль!
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .roles(Set.of(Role.ROLE_USER)) // По умолчанию присваиваем роль USER
                .build();

        // 3. Сохраняем пользователя в базе данных
        userRepository.save(user);

        // 4. Создаем объект Authentication для генерации токена
        // Важно: пароль здесь не проверяется, мы просто создаем объект для JwtService
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user, // Используем сам объект User, т.к. он реализует UserDetails
                null, // Пароль не нужен
                user.getAuthorities()
        );

        // 5. Генерируем JWT токен
        String jwtToken = jwtService.generateToken(authentication);

        // 6. Возвращаем токен и имя пользователя
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Аутентификация пользователя с помощью AuthenticationManager
        //    Он использует наш AuthenticationProvider (который использует UserDetailsService и PasswordEncoder)
        //    Если аутентификация не проходит (неверный логин/пароль), будет выброшено исключение (например, BadCredentialsException)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2. Если аутентификация прошла успешно, устанавливаем ее в SecurityContext
        //    (Хотя для stateless это необязательно, но может быть полезно)
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Получаем UserDetails из объекта Authentication
        // Мы знаем, что там наш объект User
        User user = (User) authentication.getPrincipal();

        // 4. Генерируем JWT токен
        String jwtToken = jwtService.generateToken(authentication);

        // 5. Возвращаем токен и имя пользователя
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .build();
    }
}