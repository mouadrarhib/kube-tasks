package com.kube_tasks.kube_tasks_backend.dto;

import com.kube_tasks.kube_tasks_backend.entities.TaskPriority;
import com.kube_tasks.kube_tasks_backend.entities.TaskStatus;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponseDTO {
    private Long id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private Date dueDate;
    private Date createdAt;
    private Date updatedAt;
}