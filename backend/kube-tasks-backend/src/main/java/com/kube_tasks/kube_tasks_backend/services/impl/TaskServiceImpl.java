package com.kube_tasks.kube_tasks_backend.services.impl;


import com.kube_tasks.kube_tasks_backend.dto.TaskRequestDTO;
import com.kube_tasks.kube_tasks_backend.dto.TaskResponseDTO;
import com.kube_tasks.kube_tasks_backend.entities.Task;
import com.kube_tasks.kube_tasks_backend.exceptions.TaskNotFoundException;
import com.kube_tasks.kube_tasks_backend.repositories.TaskRepository;
import com.kube_tasks.kube_tasks_backend.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return mapToDTO(task);
    }

    @Override
    @Transactional
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {
        Task task = Task.builder()
                .title(taskRequestDTO.getTitle())
                .description(taskRequestDTO.getDescription())
                .priority(taskRequestDTO.getPriority())
                .status(taskRequestDTO.getStatus())
                .dueDate(taskRequestDTO.getDueDate())
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToDTO(savedTask);
    }

    @Override
    @Transactional
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequestDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setTitle(taskRequestDTO.getTitle());
        task.setDescription(taskRequestDTO.getDescription());
        task.setPriority(taskRequestDTO.getPriority());
        task.setStatus(taskRequestDTO.getStatus());
        task.setDueDate(taskRequestDTO.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return mapToDTO(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        taskRepository.deleteById(id);
    }

    private TaskResponseDTO mapToDTO(Task task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
