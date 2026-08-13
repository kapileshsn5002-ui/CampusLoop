package com.campusloop.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusloop.backend.config.SecurityConfig.PasswordEncoder;

import com.campusloop.backend.dto.LoginRequest;
import com.campusloop.backend.dto.LoginResponse;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse authenticate(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Email and password are required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatches) {
            // Fallback for unhashed legacy string comparison, auto-upgrade to BCrypt
            if (request.getPassword().equals(user.getPassword())) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);
                passwordMatches = true;
            }
        }

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Validate role if requested
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            String requestedRole = request.getRole().trim().toUpperCase();
            String userRole = user.getRole() != null ? user.getRole().toUpperCase() : "EMPLOYEE";

            if ("MANAGER".equals(requestedRole) && !"MANAGER".equals(userRole) && !"ADMIN".equals(userRole)) {
                throw new IllegalArgumentException("Access Denied: Account does not have Manager privileges");
            }
        }

        // Ensure corresponding Employee record exists or matches leave balance
        employeeRepository.findByEmail(user.getEmail()).ifPresentOrElse(
            emp -> {
                if (user.getLeaveBalance() == null) {
                    user.setLeaveBalance(emp.getLeaveBalance() != null ? emp.getLeaveBalance() : 12);
                    userRepository.save(user);
                } else if (emp.getLeaveBalance() != null && !emp.getLeaveBalance().equals(user.getLeaveBalance())) {
                    emp.setLeaveBalance(user.getLeaveBalance());
                    employeeRepository.save(emp);
                }
            },
            () -> {
                Employee emp = new Employee();
                emp.setName(user.getFullName());
                emp.setEmail(user.getEmail());
                emp.setPassword(user.getPassword());
                emp.setRole(user.getRole());
                emp.setLeaveBalance(user.getLeaveBalance() != null ? user.getLeaveBalance() : 12);
                employeeRepository.save(emp);
            }
        );

        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getLeaveBalance() != null ? user.getLeaveBalance() : 12,
                user.getDepartment() != null ? user.getDepartment() : "Software Engineering",
                "Authentication successful"
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
