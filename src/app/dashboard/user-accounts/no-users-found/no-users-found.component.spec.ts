import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoUsersFoundComponent } from './no-users-found.component';

describe('NoUsersFoundComponent', () => {
  let component: NoUsersFoundComponent;
  let fixture: ComponentFixture<NoUsersFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoUsersFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoUsersFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
