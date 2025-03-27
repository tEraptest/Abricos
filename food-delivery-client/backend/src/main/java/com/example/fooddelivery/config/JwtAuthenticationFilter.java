package com.example.fooddelivery.config; // Или com.example.fooddelivery.security

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.fooddelivery.service.JwtService;
import com.example.fooddelivery.service.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain; // <<<=== ДОБАВЬ ЭТУ СТРОКУ
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String token = jwtService.getTokenFromRequest(request);
        final String username;

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
             username = jwtService.extractUsername(token);
        } catch (Exception e){
             filterChain.doFilter(request, response);
             return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Загружаем UserDetails - тип UserDetails теперь распознается
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Проверяем валидность токена - тип UserDetails теперь распознается
            if (jwtService.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}