import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TaskService } from '../core/services/task.service';
import { Router } from '@angular/router';
import { Task } from '../shared/models/task';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-task-details',
    imports: [CommonModule],
    templateUrl: './task-details.component.html',
    styleUrl: './task-details.component.css',
    animations: [
        trigger('fadeInOut', [
            state('void', style({ opacity: 0 })),
            state('*', style({ opacity: 1 })),
            transition('void <=> *', animate('200ms ease-in-out'))
        ]),
        trigger('slideInOut', [
            state('void', style({
                transform: 'translateY(-50px) scale(0.95)',
                opacity: 0
            })),
            state('*', style({
                transform: 'translateY(0) scale(1)',
                opacity: 1
            })),
            transition('void => *', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            transition('* => void', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
        ])
    ]
})
export class TaskDetailsComponent {
  @Input() taskId: string = '';
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  task: Task | null = null;
  
  private keyboardListener?: (event: KeyboardEvent) => void;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskId'] && this.taskId) {
      this.loadTask();
    }
  }

  ngOnDestroy(): void {
    if (this.keyboardListener) {
      document.removeEventListener('keydown', this.keyboardListener);
    }
  }

  loadTask(): void {
    if (!this.taskId) return;
    
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        console.log("Task loaded : ", task);
        this.task = task;
      },
      error: (err) => {
        console.error('Error loading task:', err);
        this.close();
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  editTask(): void {
    if (this.task) {
      this.close();
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
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

  getTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      'Bug': '🐛',
      'Feature': '✨',
      'Improvement': '🔧',
      'Research': '🔍'
    };
    return typeIcons[type] || '📋';
  }

  // Status Timeline Methods
  getAllStatuses(): string[] {
    return ['New', 'InProgress', 'Completed'];
  }

  getStatusOrder(): { [key: string]: number } {
    return {
      'New': 0,
      'InProgress': 1,
      'OnHold': 1, // Same level as InProgress
      'Completed': 2,
      'Cancelled': -1 // Special case
    };
  }

  isStatusCompleted(timelineStatus: string, currentStatus: string): boolean {
    if (currentStatus === 'Cancelled') return false;
    
    const statusOrder = this.getStatusOrder();
    const timelineOrder = statusOrder[timelineStatus];
    const currentOrder = statusOrder[currentStatus];
    
    return currentOrder > timelineOrder;
  }

  getTimelineStepClasses(timelineStatus: string, currentStatus: string): string {
    if (currentStatus === 'Cancelled') {
      return 'bg-gray-200 border-gray-300';
    }
    
    if (this.isStatusCompleted(timelineStatus, currentStatus)) {
      return 'bg-green-500 border-green-500';
    }
    
    if (timelineStatus === currentStatus) {
      return 'bg-blue-500 border-blue-500';
    }
    
    return 'bg-gray-200 border-gray-300';
  }

  getCurrentStatusDotClasses(timelineStatus: string, currentStatus: string): string {
    if (timelineStatus === currentStatus) {
      return 'bg-white';
    }
    return 'bg-gray-400';
  }

  getTimelineTextClasses(timelineStatus: string, currentStatus: string): string {
    if (currentStatus === 'Cancelled') {
      return 'text-gray-400';
    }
    
    if (this.isStatusCompleted(timelineStatus, currentStatus) || timelineStatus === currentStatus) {
      return 'text-gray-900';
    }
    
    return 'text-gray-400';
  }

  getConnectorClasses(timelineStatus: string, currentStatus: string): string {
    if (currentStatus === 'Cancelled') {
      return 'bg-gray-200';
    }
    
    if (this.isStatusCompleted(timelineStatus, currentStatus)) {
      return 'bg-green-300';
    }
    
    return 'bg-gray-200';
  }

  // Handle backdrop clicks
  onBackdropClick(event: Event): void {
    event.preventDefault();
    this.close();
  }

}
