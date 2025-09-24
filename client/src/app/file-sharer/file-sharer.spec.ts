import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSharer } from './file-sharer';

describe('FileSharer', () => {
  let component: FileSharer;
  let fixture: ComponentFixture<FileSharer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSharer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSharer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
