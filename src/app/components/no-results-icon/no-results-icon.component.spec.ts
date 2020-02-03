import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultsIconComponent } from './no-results-icon.component';

describe('NoResultsIconComponent', () => {
  let component: NoResultsIconComponent;
  let fixture: ComponentFixture<NoResultsIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoResultsIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
