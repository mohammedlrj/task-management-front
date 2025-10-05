import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../shared/models/task';
import { TaskService } from '../core/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-task-form',
    imports: [CommonModule, FormsModule],
    templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  @Input() isEditMode = false;
  isSubmitting = false;
  task: Task = {
    id: '',
    name: '',
    description: '',
    type: '',
    created: null,
    status: 'New',
  };
  taskStatuses = [
    { value: 'New', label: 'New' },
    { value: 'InProgress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'OnHold', label: 'On Hold' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];
  taskTypes = ['Bug', 'Feature', 'Improvement', 'Research'];
  // isEditMode = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskService.getTaskById(id).subscribe({
        next: (task) => {
          this.task = task;
        },
        error: (err) => {
          console.error('Error loading task:', err);
          // Optionally redirect to task list if task not found
          this.router.navigate(['/tasks']);
        }
      });
    }
  }

  getTypeLabel(type: string): string {
    const typeLabels: { [key: string]: string } = {
      'Bug': '🐛 Bug Fix',
      'Feature': '✨ New Feature',
      'Improvement': '🔧 Improvement',
      'Research': '🔍 Research'
    };
    return typeLabels[type] || type;
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      New: 'New',
      InProgress: 'In Progress',
      Completed: 'Completed',
      OnHold: 'On Hold',
      Cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getStatusClasses(status: string): string {
    const statusClasses: { [key: string]: string } = {
      New: 'bg-gray-100 text-gray-800',
      InProgress: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      OnHold: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusDotClasses(status: string): string {
    const dotClasses: { [key: string]: string } = {
      New: 'bg-gray-400',
      InProgress: 'bg-blue-400',
      Completed: 'bg-green-400',
      OnHold: 'bg-yellow-400',
      Cancelled: 'bg-red-400'
    };
    return dotClasses[status] || 'bg-gray-400';
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    if (this.isEditMode) {
      this.taskService.updateTask(this.task.id, this.task).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error updating task:', err);
          // You could add toast notification here
        }
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error creating task:', err);
          // You could add toast notification here
        }
      });
    }
  }
}
