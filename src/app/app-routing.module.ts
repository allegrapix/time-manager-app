import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TaskComponent } from './my-tasks/task/task.component';
import { NewTaskComponent } from './my-tasks/new-task/new-task.component';
import { NoTaskComponent } from './my-tasks/no-task/no-task.component';
import { AuthGuard, AdminManagerGuard } from './services/auth.guard';
import { TaskResolver } from './services/task-resolver.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserAccountsComponent } from './dashboard/user-accounts/user-accounts.component';
import { TaskManagerComponent } from './dashboard/task-manager/task-manager.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, AdminManagerGuard],
    children: [
      {
        path: 'accounts',
        component: UserAccountsComponent
      },
      {
        path: 'taks-manager',
        component: TaskManagerComponent
      }
    ]
  },
  { 
    path: 'mytasks', 
    component: MyTasksComponent, 
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'noTask', 
        component: NoTaskComponent 
      },
      { 
        path: 'new', 
        component: NewTaskComponent 
      },
      { 
        path: ':id',
         component: TaskComponent 
      },
      { 
        path: ':id/edit-task', 
        component: NewTaskComponent,
        resolve: {
          task: TaskResolver
        }
      }
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
    path: 'edit-profile',
    canActivate: [AuthGuard],
    component: EditProfileComponent
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'register', 
    component: RegisterComponent
  },
  {
    path: 'pageNotFound',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/pageNotFound'
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
