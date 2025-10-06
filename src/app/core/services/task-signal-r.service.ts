import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../shared/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskSignalRService {
  private hubConnection!: signalR.HubConnection;
  private taskUpdatesSubject = new BehaviorSubject<Task | null>(null);
  taskUpdates$ = this.taskUpdatesSubject.asObservable();

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://taskmanagementapp.azurewebsites.net/taskHub")
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(err => console.error('SignalR error: ', err));

    this.hubConnection.on('TaskUpdated', (task: Task) => {
      this.taskUpdatesSubject.next(task);
    });
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  constructor() { }
}
