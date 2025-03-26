package com.example.fooddelivery.service; // Убедись, что пакет правильный

import com.example.fooddelivery.model.User;
import com.example.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor; // Lombok для конструктора
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Для управления транзакциями

@Service // Помечаем как сервис Spring
@RequiredArgsConstructor // Lombok: генерирует конструктор с final полями (для @Autowired)
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository; // Внедряем репозиторий пользователей

    @Override
    @Transactional(readOnly = true) // Транзакция только для чтения, т.к. мы только ищем пользователя
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Ищем пользователя в репозитории по имени пользователя (логину)
        // Если пользователь не найден, выбрасываем исключение UsernameNotFoundException
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // Возвращаем найденного пользователя (он уже реализует UserDetails)
        return user;
    }
}