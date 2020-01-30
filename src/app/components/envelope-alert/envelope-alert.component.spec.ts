import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvelopeAlertComponent } from './envelope-alert.component';

describe('EnvelopeAlertComponent', () => {
  let component: EnvelopeAlertComponent;
  let fixture: ComponentFixture<EnvelopeAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvelopeAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopeAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
