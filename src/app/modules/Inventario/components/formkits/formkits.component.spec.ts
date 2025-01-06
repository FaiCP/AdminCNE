import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormkitsComponent } from './formkits.component';

describe('FormkitsComponent', () => {
  let component: FormkitsComponent;
  let fixture: ComponentFixture<FormkitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormkitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormkitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
