import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TaskComponent } from './my-tasks/task/task.component';
import { EditTaskComponent } from './my-tasks/edit-task/edit-task.component';
import { NewTaskComponent } from './my-tasks/new-task/new-task.component';
import { NoTaskComponent } from './my-tasks/no-task/no-task.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent
  },
  { 
    path: 'mytasks', 
    component: MyTasksComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'noTask', component: NoTaskComponent },
      { path: 'new', component: NewTaskComponent },
      { path: ':id', component: TaskComponent },
      { path: ':id/edit-task', component: EditTaskComponent }
    ] 
  },
  { 
    path: 'myschedule', 
    canActivate: [AuthGuard],
    component: ScheduleComponent 
  },
  { 
    path: 'myprofile', 
    canActivate: [AuthGuard],
    component: ProfileComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'register', 
    component: RegisterComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
