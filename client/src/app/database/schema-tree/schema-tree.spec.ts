import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaTree } from './schema-tree';

describe('SchemaTree', () => {
  let component: SchemaTree;
  let fixture: ComponentFixture<SchemaTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
