package com.example.fooddelivery.config; // Убедись, что пакет правильный

import com.example.fooddelivery.service.UserDetailsServiceImpl; // Наш сервис для загрузки UserDetails
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // Для аннотаций @PreAuthorize и т.д. (опционально)
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // Для отключения CSRF и др.
import org.springframework.security.config.http.SessionCreationPolicy; // Для STATELESS сессий
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Для добавления нашего фильтра

@Configuration // Помечаем как конфигурационный класс Spring
@EnableWebSecurity // Включаем веб-безопасность Spring Security
@EnableMethodSecurity(prePostEnabled = true) // Включаем проверку прав на уровне методов (опционально)
@RequiredArgsConstructor // Lombok для конструктора
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService; // Наш сервис загрузки UserDetails
    private final JwtAuthenticationFilter jwtAuthFilter; // Наш JWT фильтр (создадим его следующим шагом)

    // Бин для шифрования паролей (используем BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Бин AuthenticationProvider, который использует наш UserDetailsService и PasswordEncoder
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Указываем наш сервис
        authProvider.setPasswordEncoder(passwordEncoder());     // Указываем наш шифратор паролей
        return authProvider;
    }

    // Бин AuthenticationManager (нужен для аутентификации при логине)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Основной бин конфигурации SecurityFilterChain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Отключаем CSRF (Cross-Site Request Forgery), т.к. используем JWT (stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // Настройка правил авторизации для запросов
                .authorizeHttpRequests(auth -> auth
                        // Разрешаем доступ без аутентификации к эндпоинтам регистрации и логина
                        .requestMatchers("/api/auth/**").permitAll()
                        // Разрешаем доступ к Swagger UI (если будешь использовать)
                         .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        // Разрешаем доступ к статическим ресурсам фронтенда (если он будет сервером) - Опционально!
                        // .requestMatchers("/", "/index.html", "/static/**", "/*.png", "/*.ico", "/*.json").permitAll()
                         // Разрешаем GET запросы к продуктам для всех (пример)
                         .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()
                        // Все остальные запросы требуют аутентификации
                        .anyRequest().authenticated()
                )

                // Настраиваем управление сессиями - STATELESS, т.к. используем JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Указываем наш AuthenticationProvider
                .authenticationProvider(authenticationProvider())

                // Добавляем наш JWT фильтр ПЕРЕД стандартным фильтром UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}