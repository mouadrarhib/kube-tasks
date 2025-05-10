package com.kube_tasks.kube_tasks_backend.repositories;

import com.kube_tasks.kube_tasks_backend.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}