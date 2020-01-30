import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvelopeSuccessComponent } from './envelope-success.component';

describe('EnvelopeSuccessComponent', () => {
  let component: EnvelopeSuccessComponent;
  let fixture: ComponentFixture<EnvelopeSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvelopeSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
