import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from './user.model';
import { trigger, transition, style, group, animate } from '@angular/animations';
import { TasksService } from '../services/tasks.service';
import { Subscription } from 'rxjs';
import { Task } from '../my-tasks/task/task.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('editField', [
      transition(':enter', [
        style({ 
            opacity: 0
          }),
        group([
          animate('250ms ease-in',
            style({ 
              opacity: 1
            })
          )
        ])
      ])
    ]),
    trigger('expandField', [
      transition(':enter', [
        style({ 
            opacity: 0,
            width: 0
          }),
        group([
          animate('250ms ease-in-out',
            style({ 
              opacity: 1,
              width: '100%'
            })
          )
        ])
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dropdownStatusForm', {static: true}) dropdownStatusForm: NgForm;
  @ViewChild('listItem', {static: true}) listItem: ElementRef;
  @ViewChild('workingHoursForm', {static: true}) workingHoursForm: NgForm;
  defaultStatus = 'all';
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  dropDownIsOpen = false;
  selectedFile: File = null;
  avatarForm: FormGroup;
  base64Image: SafeUrl;
  noAvatar = true;
  loadingBar = 0;
  isLoading = false;
  dropdownStatusIsOpen = false;
  listHeight;
  options = [
    { name: 'all', value: 'all' },
    { name: 'ongoing', value: 'ongoing' },
    { name: 'completed', value: 'completed' },
    { name: 'to do', value: 'todo' }
  ];
  loggedUser: User;
  editName = false;
  editEmail = false;
  usernameEditForm: FormGroup;
  emailEditForm: FormGroup;
  locStorage;
  selectedDate: Date = new Date();
  getTasksSub: Subscription; 
  noTask: Task = {
    status: "",
    workedHours: 0,
    _id: "new",
    title: "No tasks",
    description: ""
  }
  tasks: Task[] = [this.noTask];
  selectedStatus = 'all';
  calendarSub: Subscription;
  showNoTasks = false;
  
  constructor(
    private userService: UserService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private auth: AuthService, 
    private taskService: TasksService,
    private elRef: ElementRef
    ) { }

  ngOnInit() {    
    this.calendarSub = this.taskService.newDateSelected.subscribe(newDate => {
      this.selectedDate = new Date(newDate); 
      this.loadSelectedDayTasks(this.selectedDate);
    });
    this.getUserAvatar();
    this.getUser();
    this.locStorage = JSON.parse(localStorage.getItem('userData'));
  }

  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    this.getTasksSub.unsubscribe();
  }

  editUsername() {
    this.editName = true;
    this.usernameEditForm = new FormGroup({
      'name': new FormControl(this.loggedUser.name, Validators.required)
    });
  }

  usernameCancel() {
    this.editName = false;
  }

  submitNewName() {
    this.patchUserInfo(this.usernameEditForm);
    this.editName = false;
  }

  editUserEmail() {
    this.editEmail = true;
    this.emailEditForm = new FormGroup({
      'email': new FormControl(this.loggedUser.email, [Validators.required, Validators.email])
    });
  }

  emailCancel() {
    this.editEmail = false;
  }

  submitNewEmail() {
    this.patchUserInfo(this.emailEditForm);
    this.editEmail = false;
  }

  changeWorkingHours(event: any) {
    const wh = new FormGroup({
      'preferredWorkingHours': new FormControl(parseInt(event.target.value), Validators.required)
    });
    this.patchUserInfo(wh);
  }
  
  patchUserInfo(userInfo: FormGroup) {
    const objKey = Object.keys(userInfo.value)[0];
    this.userService.editUser(userInfo.value).subscribe((updatedUser: User) => {
      this.locStorage[objKey] = updatedUser[objKey];
      localStorage.setItem('userData', JSON.stringify(this.locStorage));
      this.auth.autoLogin();
    });
  }

  getUser() {
    this.auth.user.subscribe(user => {
      this.loggedUser = user;
    });
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  rotateStatusArrow() {
    this.dropdownStatusIsOpen = !this.dropdownStatusIsOpen;
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0]; 
    this.onSubmit();
  }

  getUserAvatar() {
    this.userService.getUser().subscribe(user => {
      if (user.avatar) {
        this.noAvatar = false;
        this.base64Image  = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${user.avatar}`);
        this.auth.user.value.avatar = user.avatar;
      } else {
        this.noAvatar = true
      }
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('avatar', this.selectedFile, this.selectedFile.name);
    this.userService
    .postAvatar(formData)
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.isLoading = true;
        this.loadingBar = Math.round(event.loaded / event.total * 100);
      } else if (event.type === HttpEventType.Response) {
        setTimeout(() => {
          this.isLoading = false;
          this.getUserAvatar();
        }, 500);
      }
    });
  }

  goToEditProfile() {
    this.router.navigate(['edit-profile']);
  }

  deleteProfile() {
    this.userService.deleteUser().subscribe(resData => {
      localStorage.removeItem('userData');
      this.router.navigate(['login']);      
    });
  }

  navigateToNewTask() {
    this.router.navigate(['/mytasks/new']);
  }

  loadSelectedDayTasks(selDate: Date) {
    const selDay = selDate.getDate();
    const selMonth = selDate.getMonth();
    this.getTasksSub = this.taskService.getTasks(this.selectedStatus, undefined, undefined).subscribe(resData => {
      this.tasks = [];
      resData.filter((task: Task) => {
        const dd = new Date(task.updatedAt).getDate();
        const mm = new Date(task.updatedAt).getMonth();
        if (selDay === dd && selMonth === mm) {
          this.tasks.push(task);
        }        
      }); 
      if(this.tasks.length === 0) {
        this.tasks.push(this.noTask);
      }
    },
    (err) => {},
    () => {
      const stuff = this.elRef.nativeElement.querySelector('.task-item')
      this.listHeight = (stuff.offsetHeight + 15) * 3;
    });
  }

  getColor(status: string) {
    const color = this.taskService.getColor(status);
    return color;
  }

  goToTask(task: Task) {
    this.router.navigate(['mytasks', task._id], {queryParams: {status:'all'}});
  }

  newStatusSelected(event: any) {
    this.selectedStatus = event.target.value;
    this.loadSelectedDayTasks(this.selectedDate);
  }
}
