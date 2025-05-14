import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../shared/task-form/task-form.component';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TaskFormComponent],
  template: `
    <section class="task-edit-container slide-in">
      <div class="flex justify-between align-center mb-6">
        <h1>Edit Task</h1>
        <button routerLink="/tasks" class="btn-secondary">
          Back to Tasks
        </button>
      </div>
      
      <div *ngIf="!task" class="loading-message card">
        <p>Loading task...</p>
      </div>
      
      <div *ngIf="task" class="card">
        <app-task-form 
          [formGroup]="taskForm" 
          (submitForm)="onSubmit()"
          submitButtonText="Update Task">
        </app-task-form>
      </div>
    </section>
  `,
  styles: [`
    .task-edit-container {
      animation: slideIn 0.3s ease-in-out;
    }
    
    .loading-message {
      text-align: center;
      padding: var(--space-6);
    }
    
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class TaskEditComponent implements OnInit {
  taskId!: number;
  task?: Task;
  taskForm!: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      this.loadTask();
    });
  }

  createForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      priority: [TaskPriority.MEDIUM, Validators.required],
      status: [TaskStatus.TODO, Validators.required],
      dueDate: [null]
    });
  }

  loadTask(): void {
    this.loading = true;
    this.errorMessage = '';
    this.taskService.getTaskById(this.taskId).subscribe({
      next: task => {
        if (!task) {
          this.router.navigate(['/tasks']);
          return;
        }
        this.task = task;
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load task. Please try again.';
        this.loading = false;
      }
    });
  }

   onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const { title, description, priority, status, dueDate } = this.taskForm.value;
      this.taskService.updateTask(this.taskId, { title, description, priority, status, dueDate }).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => {
          this.errorMessage = 'Failed to update task. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}