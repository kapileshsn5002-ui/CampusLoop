package com.campusloop.backend.dto;

public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Integer leaveBalance;
    private String department;
    private String message;

    public LoginResponse() {}

    public LoginResponse(Long id, String name, String email, String role, Integer leaveBalance, String department, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.leaveBalance = leaveBalance;
        this.department = department;
        this.message = message;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getLeaveBalance() { return leaveBalance; }
    public void setLeaveBalance(Integer leaveBalance) { this.leaveBalance = leaveBalance; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
