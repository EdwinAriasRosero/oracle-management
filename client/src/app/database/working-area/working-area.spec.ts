import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingArea } from './working-area';

describe('WorkingArea', () => {
  let component: WorkingArea;
  let fixture: ComponentFixture<WorkingArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
