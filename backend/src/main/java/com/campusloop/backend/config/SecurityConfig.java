package com.campusloop.backend.config;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    public interface PasswordEncoder {
        String encode(CharSequence rawPassword);
        boolean matches(CharSequence rawPassword, String encodedPassword);
    }

    public static class Sha256PasswordEncoder implements PasswordEncoder {

        private static final int SALT_LENGTH = 16;

        @Override
        public String encode(CharSequence rawPassword) {
            if (rawPassword == null) return null;
            byte[] salt = new byte[SALT_LENGTH];
            new SecureRandom().nextBytes(salt);
            String saltBase64 = Base64.getEncoder().encodeToString(salt);
            String hashBase64 = hashWithSalt(rawPassword.toString(), salt);
            return "sha256$" + saltBase64 + "$" + hashBase64;
        }

        @Override
        public boolean matches(CharSequence rawPassword, String encodedPassword) {
            if (rawPassword == null || encodedPassword == null) return false;

            if (encodedPassword.startsWith("sha256$")) {
                String[] parts = encodedPassword.split("\\$");
                if (parts.length == 3) {
                    String saltBase64 = parts[1];
                    String expectedHashBase64 = parts[2];
                    byte[] salt = Base64.getDecoder().decode(saltBase64);
                    String computedHashBase64 = hashWithSalt(rawPassword.toString(), salt);
                    return MessageDigest.isEqual(
                        computedHashBase64.getBytes(StandardCharsets.UTF_8),
                        expectedHashBase64.getBytes(StandardCharsets.UTF_8)
                    );
                }
            }

            // Fallback for plain text matching
            return rawPassword.toString().equals(encodedPassword);
        }

        private String hashWithSalt(String password, byte[] salt) {
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                digest.update(salt);
                byte[] hashedBytes = digest.digest(password.getBytes(StandardCharsets.UTF_8));
                return Base64.getEncoder().encodeToString(hashedBytes);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("SHA-256 algorithm not available", e);
            }
        }
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Sha256PasswordEncoder();
    }
}
