package com.campusloop.backend.config;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.campusloop.backend.config.SecurityConfig.PasswordEncoder;
import com.campusloop.backend.Employee;
import com.campusloop.backend.EmployeeRepository;
import com.campusloop.backend.LeaveRequest;
import com.campusloop.backend.LeaveRequestRepository;
import com.campusloop.backend.User;
import com.campusloop.backend.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsersAndEmployees();
        seedLeaveRequests();
    }

    private void seedUsersAndEmployees() {
        // Seed Employee (Total allocated = 20, 9 approved used = 11 remaining)
        User empUser = userRepository.findByEmail("employee@campusloop.edu").orElse(null);
        if (empUser == null) {
            empUser = new User();
            empUser.setEmail("employee@campusloop.edu");
            empUser.setPassword(passwordEncoder.encode("password123"));
            empUser.setRole("EMPLOYEE");
            empUser.setFullName("Kapilesh Sharma");
            empUser.setLeaveBalance(11);
            empUser.setDepartment("Software Engineering");
            userRepository.save(empUser);
        } else {
            empUser.setLeaveBalance(11);
            userRepository.save(empUser);
        }

        Employee emp = employeeRepository.findByEmail("employee@campusloop.edu").orElse(null);
        if (emp == null) {
            emp = new Employee();
            emp.setName("Kapilesh Sharma");
            emp.setEmail("employee@campusloop.edu");
            emp.setPassword(passwordEncoder.encode("password123"));
            emp.setRole("EMPLOYEE");
            emp.setLeaveBalance(11);
            employeeRepository.save(emp);
        } else {
            emp.setLeaveBalance(11);
            employeeRepository.save(emp);
        }

        // Seed Manager
        User mgrUser = userRepository.findByEmail("manager@campusloop.edu").orElse(null);
        if (mgrUser == null) {
            mgrUser = new User();
            mgrUser.setEmail("manager@campusloop.edu");
            mgrUser.setPassword(passwordEncoder.encode("password123"));
            mgrUser.setRole("MANAGER");
            mgrUser.setFullName("Sarah Jenkins");
            mgrUser.setLeaveBalance(15);
            mgrUser.setDepartment("Engineering Leadership");
            userRepository.save(mgrUser);
        }

        Employee mgr = employeeRepository.findByEmail("manager@campusloop.edu").orElse(null);
        if (mgr == null) {
            mgr = new Employee();
            mgr.setName("Sarah Jenkins");
            mgr.setEmail("manager@campusloop.edu");
            mgr.setPassword(passwordEncoder.encode("password123"));
            mgr.setRole("MANAGER");
            mgr.setLeaveBalance(15);
            employeeRepository.save(mgr);
        }
    }

    private void seedLeaveRequests() {
        // Reset or seed fresh demo leave records if count is small or fresh
        if (leaveRequestRepository.count() == 0 || leaveRequestRepository.count() >= 1) {
            leaveRequestRepository.deleteAll();

            User empUser = userRepository.findByEmail("employee@campusloop.edu").orElse(null);
            Long empId = empUser != null ? empUser.getId() : 1L;

            // Past Approved 1: Earned Leave (4 days)
            LeaveRequest lr1 = new LeaveRequest();
            lr1.setEmployeeId(empId);
            lr1.setEmployeeName("Kapilesh Sharma");
            lr1.setDepartment("Software Engineering");
            lr1.setLeaveType("Earned Leave");
            lr1.setStartDate(LocalDate.of(2026, 5, 12));
            lr1.setEndDate(LocalDate.of(2026, 5, 15));
            lr1.setDays(4);
            lr1.setReason("Annual family vacation trip.");
            lr1.setStatus("APPROVED");
            lr1.setManagerComment("Approved annual vacation request.");
            lr1.setCreatedAt(LocalDateTime.now().minusDays(90));
            lr1.setUpdatedAt(LocalDateTime.now().minusDays(88));
            leaveRequestRepository.save(lr1);

            // Past Approved 2: Sick Leave (3 days)
            LeaveRequest lr2 = new LeaveRequest();
            lr2.setEmployeeId(empId);
            lr2.setEmployeeName("Kapilesh Sharma");
            lr2.setDepartment("Software Engineering");
            lr2.setLeaveType("Sick Leave");
            lr2.setStartDate(LocalDate.of(2026, 6, 20));
            lr2.setEndDate(LocalDate.of(2026, 6, 22));
            lr2.setDays(3);
            lr2.setReason("High fever and medical rest advice.");
            lr2.setStatus("APPROVED");
            lr2.setManagerComment("Medical leave approved. Get well soon.");
            lr2.setCreatedAt(LocalDateTime.now().minusDays(55));
            lr2.setUpdatedAt(LocalDateTime.now().minusDays(54));
            leaveRequestRepository.save(lr2);

            // Upcoming Approved 1: Casual Leave (1 day)
            LeaveRequest lr3 = new LeaveRequest();
            lr3.setEmployeeId(empId);
            lr3.setEmployeeName("Kapilesh Sharma");
            lr3.setDepartment("Software Engineering");
            lr3.setLeaveType("Casual Leave");
            lr3.setStartDate(LocalDate.of(2026, 8, 28));
            lr3.setEndDate(LocalDate.of(2026, 8, 28));
            lr3.setDays(1);
            lr3.setReason("Personal administrative work.");
            lr3.setStatus("APPROVED");
            lr3.setManagerComment("Personal day approved.");
            lr3.setCreatedAt(LocalDateTime.now().minusDays(10));
            lr3.setUpdatedAt(LocalDateTime.now().minusDays(8));
            leaveRequestRepository.save(lr3);

            // Upcoming Approved 2: Casual Leave (1 day)
            LeaveRequest lr4 = new LeaveRequest();
            lr4.setEmployeeId(empId);
            lr4.setEmployeeName("Kapilesh Sharma");
            lr4.setDepartment("Software Engineering");
            lr4.setLeaveType("Casual Leave");
            lr4.setStartDate(LocalDate.of(2026, 9, 15));
            lr4.setEndDate(LocalDate.of(2026, 9, 15));
            lr4.setDays(1);
            lr4.setReason("Family event gathering.");
            lr4.setStatus("APPROVED");
            lr4.setManagerComment("Approved.");
            lr4.setCreatedAt(LocalDateTime.now().minusDays(5));
            lr4.setUpdatedAt(LocalDateTime.now().minusDays(4));
            leaveRequestRepository.save(lr4);

            // Pending Request 1: Earned Leave (2 days)
            LeaveRequest lr5 = new LeaveRequest();
            lr5.setEmployeeId(empId);
            lr5.setEmployeeName("Kapilesh Sharma");
            lr5.setDepartment("Software Engineering");
            lr5.setLeaveType("Earned Leave");
            lr5.setStartDate(LocalDate.of(2026, 10, 12));
            lr5.setEndDate(LocalDate.of(2026, 10, 13));
            lr5.setDays(2);
            lr5.setReason("Attending annual tech conference and workshops.");
            lr5.setStatus("PENDING");
            lr5.setCreatedAt(LocalDateTime.now().minusDays(1));
            lr5.setUpdatedAt(LocalDateTime.now().minusDays(1));
            leaveRequestRepository.save(lr5);
        }
    }
}
