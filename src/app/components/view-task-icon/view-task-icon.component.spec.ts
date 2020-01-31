import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskIconComponent } from './view-task-icon.component';

describe('ViewTaskIconComponent', () => {
  let component: ViewTaskIconComponent;
  let fixture: ComponentFixture<ViewTaskIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTaskIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
