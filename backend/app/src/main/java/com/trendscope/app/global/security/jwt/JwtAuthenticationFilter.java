package com.trendscope.app.global.security.jwt;

import com.trendscope.app.global.security.principal.CustomUserDetails;
import com.trendscope.app.global.security.principal.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final JwtTokenResolver jwtTokenResolver;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtProvider jwtProvider, JwtTokenResolver jwtTokenResolver, CustomUserDetailsService userDetailsService) {
        this.jwtProvider = jwtProvider;
        this.jwtTokenResolver = jwtTokenResolver;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = jwtTokenResolver.resolve(request);
        if (token != null && jwtProvider.validateToken(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
            UUID userId = jwtProvider.extractUserId(token);
            CustomUserDetails principal = userDetailsService.loadByUserId(userId);
            var authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
