package com.kube_tasks.kube_tasks_backend.services;

import com.kube_tasks.kube_tasks_backend.dto.TaskRequestDTO;
import com.kube_tasks.kube_tasks_backend.dto.TaskResponseDTO;

import java.util.List;

public interface TaskService {
    List<TaskResponseDTO> getAllTasks();
    TaskResponseDTO getTaskById(Long id);
    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO);
    TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequestDTO);
    void deleteTask(Long id);
}