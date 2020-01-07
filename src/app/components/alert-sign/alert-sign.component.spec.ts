import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSignComponent } from './alert-sign.component';

describe('AlertSignComponent', () => {
  let component: AlertSignComponent;
  let fixture: ComponentFixture<AlertSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
