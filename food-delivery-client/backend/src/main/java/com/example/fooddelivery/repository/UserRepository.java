package com.example.fooddelivery.repository; // Убедись, что пакет правильный

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fooddelivery.model.User;

@Repository // Указывает, что это Spring Data репозиторий
public interface UserRepository extends JpaRepository<User, Long> { // Наследуемся от JpaRepository для сущности User с ID типа Long

    // Метод для поиска пользователя по имени пользователя (логину)
    // Spring Data JPA автоматически сгенерирует реализацию по названию метода
    Optional<User> findByUsername(String username);

    // Метод для поиска пользователя по email
    Optional<User> findByEmail(String email);

    // Метод для проверки существования пользователя по имени
    // Возвращает true, если пользователь с таким username существует, иначе false
    Boolean existsByUsername(String username);

    // Метод для проверки существования пользователя по email
    // Возвращает true, если пользователь с таким email существует, иначе false
    Boolean existsByEmail(String email);

}