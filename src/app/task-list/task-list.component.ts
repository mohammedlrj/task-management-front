import { Component, OnInit } from '@angular/core';
import { Task } from '../shared/models/task';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../core/services/task.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskDetailsComponent } from "../task-details/task-details.component";

@Component({
    selector: 'app-task-list',
    imports: [CommonModule, RouterModule, TaskDetailsComponent],
    providers: [TaskService],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  showDetailsPopup = false;
  selectedTaskId = '';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
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

  loadTasks(): void {
    this.taskService.getTasksByUserId().subscribe({
      next: data => {
        console.log('Tasks received:', data);
        this.tasks = data;
      },
      error: err => console.error('Error loading tasks:', err)
    });
  }

  deleteTask(id: string): void{
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  editTask(id: string): void{
    this.router.navigate(['/tasks', id, 'edit']);
  }

  viewDetails(id: string): void {
    console.log('View details clicked, task ID:', id);
    this.selectedTaskId = id;
    this.showDetailsPopup = true;
    console.log('showDetailsPopup:', this.showDetailsPopup, 'selectedTaskId:', this.selectedTaskId);
  }

  // Method to close the popup
  closeDetailsPopup(): void {
    this.showDetailsPopup = false;
    this.selectedTaskId = '';
  }

}
