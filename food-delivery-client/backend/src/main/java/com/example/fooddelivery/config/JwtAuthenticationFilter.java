package com.example.fooddelivery.config; // Или com.example.fooddelivery.security

import java.io.IOException; // Наш сервис для работы с JWT

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Наш сервис для загрузки UserDetails
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter; // Lombok для проверки на null

import com.example.fooddelivery.service.JwtService;
import com.example.fooddelivery.service.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse; // Помечаем как компонент Spring
import lombok.NonNull; // Используем базовый класс фильтра
import lombok.RequiredArgsConstructor;

@Component // Делаем этот класс компонентом Spring, чтобы его можно было внедрить в SecurityConfig
@RequiredArgsConstructor // Lombok для конструктора
public class JwtAuthenticationFilter extends OncePerRequestFilter { // Наследуемся от OncePerRequestFilter

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService; // Используем наш UserDetailsService

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, // Запрос
            @NonNull HttpServletResponse response, // Ответ
            @NonNull FilterChain filterChain // Цепочка фильтров
    ) throws ServletException, IOException {

        // 1. Пытаемся извлечь токен из заголовка Authorization
        final String token = jwtService.getTokenFromRequest(request);
        final String username;

        // 2. Если токена нет или заголовок некорректный, просто передаем запрос дальше по цепочке
        if (token == null) {
            filterChain.doFilter(request, response);
            return; // Важно выйти из метода
        }

        // 3. Если токен есть, извлекаем имя пользователя
        try {
             username = jwtService.extractUsername(token);
        } catch (Exception e){
            // Если не удалось извлечь имя пользователя (например, токен поврежден),
            // передаем запрос дальше без установки аутентификации
             filterChain.doFilter(request, response);
             return;
        }


        // 4. Проверяем, что имя пользователя извлечено и пользователь еще не аутентифицирован
        //    (SecurityContextHolder.getContext().getAuthentication() == null)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 5. Загружаем UserDetails по имени пользователя
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 6. Проверяем валидность токена
            if (jwtService.isTokenValid(token, userDetails)) {
                // 7. Если токен валиден, создаем объект аутентификации
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, // Principal (сам пользователь)
                        null, // Credentials (пароль не нужен, т.к. аутентификация по токену)
                        userDetails.getAuthorities() // Роли (authorities) пользователя
                );
                // 8. Добавляем детали веб-запроса к объекту аутентификации
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // 9. Устанавливаем объект аутентификации в SecurityContextHolder
                //    Теперь Spring Security знает, что текущий пользователь аутентифицирован
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 10. Передаем запрос и ответ дальше по цепочке фильтров
        filterChain.doFilter(request, response);
    }
}