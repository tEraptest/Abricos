package com.example.fooddelivery.model;

import jakarta.persistence.*;
import lombok.*; // Используем Lombok для сокращения кода
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet; // Используем HashSet для хранения ролей
import java.util.Set;
import java.util.stream.Collectors;

@Data // Lombok: генерирует геттеры, сеттеры, toString, equals, hashCode
@Builder // Lombok: предоставляет builder pattern для создания объектов
@NoArgsConstructor // Lombok: генерирует конструктор без аргументов
@AllArgsConstructor // Lombok: генерирует конструктор со всеми аргументами
@Entity // Указывает, что это JPA сущность
@Table(name = "users") // Указывает имя таблицы в БД (можно users или app_users)
public class User implements UserDetails { // Реализуем UserDetails для Spring Security

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Автоматическая генерация ID
    private Long id;

    @Column(nullable = false, unique = true) // Поле не может быть null и должно быть уникальным
    private String username; // Логин пользователя

    @Column(nullable = false, unique = true)
    private String email; // Email пользователя

    @Column(nullable = false)
    private String password; // Пароль (будет храниться в хешированном виде!)

    // Опциональные поля для дополнительной информации
    private String firstName;
    private String lastName;

    // --- Роли пользователя ---
    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER) // Храним Enum как коллекцию
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id")) // Связующая таблица user_roles
    @Enumerated(EnumType.STRING) // Храним Enum как строки ("ROLE_USER", "ROLE_ADMIN")
    @Builder.Default // Lombok: значение по умолчанию для поля в Builder
    private Set<Role> roles = new HashSet<>(); // Используем Set для уникальности ролей

    // --- Реализация методов UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Преобразуем наши Enum роли в GrantedAuthority, понятные Spring Security
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return password; // Возвращаем пароль пользователя
    }

    @Override
    public String getUsername() {
        return username; // Возвращаем имя пользователя (логин)
    }

    // --- Методы для проверки состояния аккаунта ---
    // Пока сделаем их всегда true, можно добавить логику блокировки/срока действия

    @Override
    public boolean isAccountNonExpired() {
        return true; // Аккаунт не просрочен
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Аккаунт не заблокирован
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Пароль не просрочен
    }

    @Override
    public boolean isEnabled() {
        return true; // Аккаунт активен
    }
}