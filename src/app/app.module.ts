import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainbodyComponent } from './mainbody/mainbody.component';
import { FooterComponent } from './footer/footer.component';
import { ButtonsComponent } from './mainbody/buttons/buttons.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ProfileComponent } from './profile/profile.component';
import { BannerComponent } from './components/banner/banner.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginOrRegisterService } from './services/login-or-resgister.service';
import { TaskComponent } from './my-tasks/task/task.component';
import { AddBtnComponent } from './components/add-btn/add-btn.component';
import { ProfileLinkComponent } from './profile-link/profile-link.component';
import { NewTaskComponent } from './my-tasks/new-task/new-task.component';
import { ArrowLeftComponent } from './components/arrow-left/arrow-left.component';
import { ArrowRightComponent } from './components/arrow-right/arrow-right.component';
import { FilterTasksPipe } from './pipes/filter-tasks.pipe';
import { NoTaskComponent } from './my-tasks/no-task/no-task.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { AlertComponent } from './components/alert/alert.component';
import { AlertSignComponent } from './components/alert-sign/alert-sign.component';
import { PlaceHolderDirective } from './services/placeholder.directive';
import { TaskResolver } from './services/task-resolver.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OopsComponent } from './components/oops/oops.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EditBtnComponent } from './components/edit-btn/edit-btn.component';
import { OkBtnComponent } from './components/ok-btn/ok-btn.component';
import { CancelBtnComponent } from './components/cancel-btn/cancel-btn.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserAccountsComponent } from './dashboard/user-accounts/user-accounts.component';
import { TaskManagerComponent } from './dashboard/task-manager/task-manager.component';
import { AccountIconComponent } from './components/account-icon/account-icon.component';
import { TaskIconComponent } from './components/task-icon/task-icon.component';
import { AccountComponent } from './dashboard/user-accounts/account/account.component';
import { OpenProfileComponent } from './components/open-profile/open-profile.component';
import { DashboardTaskComponent } from './dashboard/user-accounts/dashboard-task/dashboard-task.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainbodyComponent,
    FooterComponent,
    ButtonsComponent,
    MyTasksComponent,
    HomeComponent,
    ScheduleComponent,
    ProfileComponent,
    BannerComponent,
    LoginComponent,
    RegisterComponent,
    TaskComponent,
    AddBtnComponent,
    ProfileLinkComponent,
    NewTaskComponent,
    ArrowLeftComponent,
    ArrowRightComponent,
    FilterTasksPipe,
    NoTaskComponent,
    SpinnerComponent,
    AlertComponent,
    AlertSignComponent,
    PlaceHolderDirective,
    PageNotFoundComponent,
    OopsComponent,
    EditProfileComponent,
    CalendarComponent,
    EditBtnComponent,
    OkBtnComponent,
    CancelBtnComponent,
    DashboardComponent,
    UserAccountsComponent,
    TaskManagerComponent,
    AccountIconComponent,
    TaskIconComponent,
    AccountComponent,
    OpenProfileComponent,
    DashboardTaskComponent,
    EditAccountComponent,
    TaskModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule,
    MaterialModule
  ],
  providers: [
    LoginOrRegisterService, 
    TaskResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AlertComponent
  ]
})
export class AppModule { }
