package com.example.next.global.security;

import com.example.next.global.app.AppConfig;
import com.example.next.global.dto.RsData;
import com.example.next.standard.Ut;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomAuthenticationFilter customAuthenticationFilter;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/h2-console/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/*/posts/{id:\\d+}",
                                "/api/*/posts",
                                "/api/*/posts/{postId:\\d+}/comments")
                        .permitAll()
                        .requestMatchers("/api/*/members/login", "/api/*/members/join", "/api/*/members/logout")
                        .permitAll()
                        .requestMatchers("api/v1/posts/statistics")
                        .hasRole("ADMIN")
                        .requestMatchers("/api/*/**")
                        .authenticated()
                        .anyRequest()
                        .permitAll()
                )
                .headers((headers) -> headers
                        .addHeaderWriter(new XFrameOptionsHeaderWriter(
                                XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)))
                .csrf(csrf -> csrf.disable())
                .addFilterBefore(customAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(
                        exceptionHandling -> exceptionHandling
                                .authenticationEntryPoint(
                                        ((request, response, authException) -> {
                                            response.setStatus(401);
                                            response.setContentType("application/json;charset=UTF-8");
                                            response.getWriter().write(
                                                    Ut.Json.toString(
                                                            new RsData<Void>("401-1", "잘못된 인증키입니다.")
                                                    )
                                            );
                                        })
                                )
                                .accessDeniedHandler(
                                        ((request, response, authException) -> {
                                            response.setStatus(403);
                                            response.setContentType("application/json;charset=UTF-8");
                                            response.getWriter().write(
                                                    Ut.Json.toString(
                                                            new RsData<Void>("403-1", "접근 권한이 없습니다.")
                                                    )
                                            );
                                        })
                                )
                );
        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 허용할 오리진 설정
        configuration.setAllowedOrigins(Arrays.asList("https://cdpn.io", AppConfig.getSiteFrontUrl()));
        // 허용할 HTTP 메서드 설정
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        // 자격 증명 허용 설정
        configuration.setAllowCredentials(true);
        // 허용할 헤더 설정
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // CORS 설정을 소스에 등록
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
