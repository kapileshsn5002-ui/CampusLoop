package com.campusloop.backend;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    public LeaveRequest applyLeave(LeaveRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }

        // Rule 1: Start date cannot be after end date
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }

        // Rule 2: Cannot request leave in the past
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot request leave in the past");
        }

        // Rule 3: Calculate number of days automatically
        long days = java.time.temporal.ChronoUnit.DAYS.between(
                request.getStartDate(), request.getEndDate()) + 1;
        request.setDays((int) days);

        // Rule 4: Employee cannot exceed available leave balance
        if (request.getEmployeeId() != null) {
            Integer availableBalance = 12;
            if (userRepository.existsById(request.getEmployeeId())) {
                User u = userRepository.findById(request.getEmployeeId()).get();
                if (u.getLeaveBalance() != null) availableBalance = u.getLeaveBalance();
            } else if (employeeRepository.existsById(request.getEmployeeId())) {
                Employee emp = employeeRepository.findById(request.getEmployeeId()).get();
                if (emp.getLeaveBalance() != null) availableBalance = emp.getLeaveBalance();
            }

            if (days > availableBalance) {
                throw new IllegalArgumentException("Insufficient leave balance (Available: " + availableBalance + " days)");
            }

            // Rule 5: Duplicate/overlapping leave check for pending/approved
            List<LeaveRequest> existingRequests = leaveRequestRepository.findByEmployeeId(request.getEmployeeId());
            for (LeaveRequest existing : existingRequests) {
                if ("REJECTED".equalsIgnoreCase(existing.getStatus())) continue;
                if (existing.getStartDate() != null && existing.getEndDate() != null) {
                    boolean overlaps = !request.getStartDate().isAfter(existing.getEndDate()) &&
                                      !request.getEndDate().isBefore(existing.getStartDate());
                    if (overlaps) {
                        throw new IllegalArgumentException("An existing leave request overlaps with these dates");
                    }
                }
            }
        }

        // Rule 6: Valid request becomes PENDING
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());

        return leaveRequestRepository.save(request);
    }

    public LeaveRequest updateStatus(Long leaveRequestId, String newStatus, String comment) {
        LeaveRequest request = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found"));

        String oldStatus = request.getStatus();
        String upperNewStatus = newStatus.toUpperCase();
        request.setStatus(upperNewStatus);

        if (comment != null && !comment.trim().isEmpty()) {
            request.setManagerComment(comment.trim());
        }
        request.setUpdatedAt(LocalDateTime.now());

        // Deduct leave balance if status changed to APPROVED
        if ("APPROVED".equalsIgnoreCase(upperNewStatus) && !"APPROVED".equalsIgnoreCase(oldStatus) && request.getEmployeeId() != null) {
            int reqDays = request.getDays() != null ? request.getDays() : 1;

            userRepository.findById(request.getEmployeeId()).ifPresent(user -> {
                int curr = user.getLeaveBalance() != null ? user.getLeaveBalance() : 12;
                user.setLeaveBalance(Math.max(0, curr - reqDays));
                userRepository.save(user);

                // Sync Employee record if exists
                employeeRepository.findByEmail(user.getEmail()).ifPresent(emp -> {
                    emp.setLeaveBalance(user.getLeaveBalance());
                    employeeRepository.save(emp);
                });
            });

            employeeRepository.findById(request.getEmployeeId()).ifPresent(emp -> {
                int curr = emp.getLeaveBalance() != null ? emp.getLeaveBalance() : 12;
                emp.setLeaveBalance(Math.max(0, curr - reqDays));
                employeeRepository.save(emp);
            });
        }

        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus("PENDING");
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAllByOrderByIdDesc();
    }

    public List<LeaveRequest> getLeavesByEmployeeId(Long employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByIdDesc(employeeId);
    }

    public LeaveRequest createLeaveRequest(LeaveRequest request) {
        return applyLeave(request);
    }
}