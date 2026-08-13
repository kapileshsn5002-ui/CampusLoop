package com.campusloop.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.campusloop.backend.dto.ErrorResponse;

@RestController
@CrossOrigin(origins = "*")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    // GET /api/leaves
    @GetMapping("/api/leaves")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    // GET /api/leaves/employee/{employeeId}
    @GetMapping("/api/leaves/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeavesByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployeeId(employeeId));
    }

    // POST /api/leaves
    @PostMapping("/api/leaves")
    public ResponseEntity<?> createLeave(@RequestBody LeaveRequest request) {
        try {
            LeaveRequest saved = leaveService.applyLeave(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Validation Error", e.getMessage(), 400));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Server Error", "Failed to submit leave request: " + e.getMessage(), 500));
        }
    }

    // PUT /api/leaves/{id}/status
    @PutMapping("/api/leaves/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest statusRequest) {
        try {
            LeaveRequest updated = leaveService.updateStatus(id, statusRequest.getStatus(), statusRequest.getComment());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid Request", e.getMessage(), 400));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Update Failed", "Failed to update status: " + e.getMessage(), 500));
        }
    }

    // Legacy endpoints
    @PostMapping("/api/leave/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest request) {
        return createLeave(request);
    }

    @GetMapping("/api/leave/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingRequests() {
        return ResponseEntity.ok(leaveService.getPendingRequests());
    }

    @PutMapping("/api/leave/{id}/status")
    public ResponseEntity<?> updateStatusLegacy(@PathVariable Long id, @RequestBody StatusUpdateRequest statusRequest) {
        return updateLeaveStatus(id, statusRequest);
    }

    public static class StatusUpdateRequest {
        private String status;
        private String comment;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}