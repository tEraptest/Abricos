package com.example.fooddelivery.service; // Убедись, что пакет правильный

import com.example.fooddelivery.model.User; // Импортируем нашу модель User
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Добавим импорты для исключений
import jakarta.servlet.http.HttpServletRequest; // Для извлечения токена из заголовка
import lombok.extern.slf4j.Slf4j; // Lombok для логирования
import org.springframework.beans.factory.annotation.Value; // Для чтения из application.properties
import org.springframework.security.core.Authentication; // Для получения данных аутентификации
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils; // Утилита для работы со строками

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j // Lombok: добавляет логгер slf4j
public class JwtService {

    // Читаем секретный ключ из application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Читаем срок жизни токена из application.properties
    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    // Метод для генерации JWT токена для пользователя
    public String generateToken(Authentication authentication) {
        // Получаем детали пользователя из объекта Authentication
        User userPrincipal = (User) authentication.getPrincipal();

        // Дополнительные данные (claims), которые мы хотим включить в токен (опционально)
        Map<String, Object> extraClaims = new HashMap<>();
        // Например, можно добавить роли пользователя, если нужно
        // extraClaims.put("roles", userPrincipal.getRoles().stream().map(Role::name).collect(Collectors.toList()));

        return buildToken(extraClaims, userPrincipal, jwtExpirationMs);
    }

    // Вспомогательный метод для построения токена
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims) // Добавляем дополнительные claims
                .setSubject(userDetails.getUsername()) // Устанавливаем имя пользователя как "subject" токена
                .setIssuedAt(new Date(System.currentTimeMillis())) // Время создания токена
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Время истечения срока действия
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Подписываем токен нашим ключом
                .compact(); // Собираем токен в строку
    }

    // Метод для извлечения имени пользователя из токена
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject); // Subject - это имя пользователя
    }

    // Обобщенный метод для извлечения любого claim из токена
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Метод для проверки валидности токена
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            // Проверяем, совпадает ли имя пользователя в токене с userDetails
            // и не истек ли срок действия токена
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false; // Если токен невалиден (ошибка парсинга, подписи, срока), возвращаем false
        }
    }

    // Метод для проверки, истек ли срок действия токена
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Метод для извлечения даты истечения срока действия из токена
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Метод для парсинга токена и извлечения всех claims
    private Claims extractAllClaims(String token) {
        // Используем try-catch для обработки различных ошибок валидации JWT
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey()) // Устанавливаем ключ для проверки подписи
                .build()
                .parseClaimsJws(token) // Парсим и проверяем токен
                .getBody(); // Получаем тело (claims)
    }

    // Метод для получения ключа подписи (декодируем секрет из Base64)
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret); // Декодируем секретный ключ
        return Keys.hmacShaKeyFor(keyBytes); // Создаем ключ для алгоритма HMAC-SHA
    }

    // --- Вспомогательные методы для работы с HttpServletRequest ---

    // Извлечение токена из заголовка "Authorization: Bearer <token>"
    public String getTokenFromRequest(HttpServletRequest request) {
        final String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Обрезаем "Bearer "
        }
        return null; // Возвращаем null, если заголовок некорректен или отсутствует
    }
}