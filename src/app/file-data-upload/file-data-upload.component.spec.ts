import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDataUploadComponent } from './file-data-upload.component';

describe('FileDataUploadComponent', () => {
  let component: FileDataUploadComponent;
  let fixture: ComponentFixture<FileDataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDataUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
