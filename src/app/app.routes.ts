import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

export const routes: Routes = [
    { path: 'tasks', component: TaskListComponent },
    { path: 'tasks/new', component: TaskFormComponent },
    { path: 'tasks/:id/edit', component: TaskFormComponent },
    { path: 'tasks/:id', component: TaskDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'navbar', component: NavbarComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
