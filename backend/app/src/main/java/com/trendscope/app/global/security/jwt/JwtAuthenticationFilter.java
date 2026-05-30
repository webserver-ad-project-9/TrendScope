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
    private final StaticTokenUserService staticTokenUserService;

    public JwtAuthenticationFilter(JwtProvider jwtProvider, JwtTokenResolver jwtTokenResolver,
                                   CustomUserDetailsService userDetailsService,
                                   StaticTokenUserService staticTokenUserService) {
        this.jwtProvider = jwtProvider;
        this.jwtTokenResolver = jwtTokenResolver;
        this.userDetailsService = userDetailsService;
        this.staticTokenUserService = staticTokenUserService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = jwtTokenResolver.resolve(request);
        if (token != null && staticTokenUserService.supports(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
            CustomUserDetails principal = staticTokenUserService.loadOrCreateStaticUser();
            setAuthentication(request, principal);
            filterChain.doFilter(request, response);
            return;
        }
        if (token != null && jwtProvider.validateToken(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
            UUID userId = jwtProvider.extractUserId(token);
            CustomUserDetails principal = userDetailsService.loadByUserId(userId);
            setAuthentication(request, principal);
        }
        filterChain.doFilter(request, response);
    }

    private void setAuthentication(HttpServletRequest request, CustomUserDetails principal) {
        var authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
