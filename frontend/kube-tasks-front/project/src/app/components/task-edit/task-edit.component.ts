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
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      priority: [TaskPriority.Medium, Validators.required],
      status: [TaskStatus.Todo, Validators.required],
      dueDate: [null],
      createdAt: [null]
    });
  }

  loadTask(): void {
    this.taskService.getTaskById(this.taskId).subscribe(task => {
      if (!task) {
        this.router.navigate(['/tasks']);
        return;
      }

      this.task = task;
      
      this.taskForm.patchValue({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        createdAt: task.createdAt
      });
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask: Task = this.taskForm.value;
      
      this.taskService.updateTask(updatedTask).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.markFormGroupTouched(this.taskForm);
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