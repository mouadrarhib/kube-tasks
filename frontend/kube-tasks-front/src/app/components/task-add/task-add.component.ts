import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../shared/task-form/task-form.component';
import { TaskPriority, TaskStatus, TaskRequest } from '../../models/task.model';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TaskFormComponent],
  template: `
    <section class="task-add-container slide-in">
      <div class="flex justify-between align-center mb-6">
        <h1>Add New Task</h1>
        <button routerLink="/tasks" class="btn-secondary">
          Back to Tasks
        </button>
      </div>
      
      <div class="card">
        <app-task-form 
          [formGroup]="taskForm" 
          (submitForm)="onSubmit()"
          submitButtonText="Create Task">
        </app-task-form>
        <div *ngIf="errorMessage" class="error mt-2">{{ errorMessage }}</div>
      </div>
    </section>
  `,
  styles: [`
    .task-add-container {
      animation: slideIn 0.3s ease-in-out;
    }
    
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .error {
      color: #d32f2f;
    }
  `]
})
export class TaskAddComponent {
  taskForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      priority: [TaskPriority.MEDIUM, Validators.required],
      status: [TaskStatus.TODO, Validators.required],
      dueDate: [null]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskRequest: TaskRequest = { ...this.taskForm.value };
      this.taskService.createTask(taskRequest).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: err => {
          this.errorMessage = 'Failed to create task. Please try again.';
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}