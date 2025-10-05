import { Component, OnInit } from '@angular/core';
import { Task } from '../shared/models/task';
import { TaskService } from '../core/services/task.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TaskSignalRService } from '../core/services/task-signal-r.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentFilter: string = 'all';
  private taskUpdateSub!: Subscription;

  constructor(private taskService: TaskService, private signalRService: TaskSignalRService) {}

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

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      New: 'status-new',
      InProgress: 'status-inprogress',
      Completed: 'status-completed',
      OnHold: 'status-onhold',
      Cancelled: 'status-cancelled'
    };
    return classMap[status] || '';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      New: 'fas fa-plus-circle',
      InProgress: 'fas fa-spinner fa-spin',
      Completed: 'fas fa-check-circle',
      OnHold: 'fas fa-pause-circle',
      Cancelled: 'fas fa-times-circle'
    };
    return iconMap[status] || 'fas fa-circle';
  }

  getTypeClass(type: string): string {
    // You can customize this based on your task types
    const typeClassMap: { [key: string]: string } = {
      'Bug': 'type-bug',
      'Feature': 'type-feature',
      'Task': 'type-task',
      'Epic': 'type-epic'
    };
    return typeClassMap[type] || 'type-default';
  }

  getPriorityClass(task: Task): string {
    // Check if task has priority property, otherwise use a default
    const priority = (task as any).priority || 'Medium'; // Default to Medium if no priority
    const priorityMap: { [key: string]: string } = {
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    };
    return priorityMap[priority] || 'priority-medium';
  }

  getTaskCountByStatus(status: string): number {
    return this.tasks.filter(task => task.status === status).length;
  }

  getTaskProgress(task: Task): number {
    // This is a mock function - you can implement actual progress calculation
    // based on your task properties (e.g., subtasks completed, time spent, etc.)
    if (task.status === 'Completed') return 100;
    if (task.status === 'InProgress') {

      if (!task.created) return 10;
      // Mock progress based on creation date (for demo purposes)
      const now = new Date().getTime();
      const created = new Date(task.created).getTime();
      const daysSinceCreation = (now - created) / (1000 * 3600 * 24);
      return Math.min(Math.floor(daysSinceCreation * 10), 95); // Max 95% for in-progress
    }
    return 0;
  }

  trackByTaskId(index: number, task: Task): any {
    return task.id;
  }

  filterTasks(status: string): void {
    this.currentFilter = status;
    if (status === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === status);
    }

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-status="${status}"]`)?.classList.add('active');
  }

  searchTasks(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filterTasks(this.currentFilter);
      return;
    }

    const filtered = this.tasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${task.user?.firstName} ${task.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredTasks = filtered;
  }

  ngOnInit() {
    this.loadTasks();
    this.signalRService.startConnection();
    this.taskUpdateSub = this.signalRService.taskUpdates$.subscribe(task => {
      if (task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = task;
          // Re-apply current filter
          this.filterTasks(this.currentFilter);
        }
      }
    });

    // Set up event listeners after view init
    setTimeout(() => {
      this.setupEventListeners();
    });
  }

  private setupEventListeners(): void {
    // Filter button event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const status = target.getAttribute('data-status') || 'all';
        this.filterTasks(status);
      });
    });

    // Search input event listener
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.searchTasks(target.value);
      });
    }
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: tasks => this.tasks = tasks,
      error: err => console.error('Failed to load tasks', err)
    });
  }

  ngOnDestroy(): void {
    if (this.taskUpdateSub) {
      this.taskUpdateSub.unsubscribe();
    }
    this.signalRService.stopConnection();
  }

}
