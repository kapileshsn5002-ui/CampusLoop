package com.campusloop.backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    List<LeaveRequest> findByEmployeeIdOrderByIdDesc(Long employeeId);
    List<LeaveRequest> findByStatus(String status);
    List<LeaveRequest> findAllByOrderByIdDesc();
}