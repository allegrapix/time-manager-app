import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CogsComponent } from './cogs.component';

describe('CogsComponent', () => {
  let component: CogsComponent;
  let fixture: ComponentFixture<CogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
