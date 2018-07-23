import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LessonDateTimePickerComponent } from './lesson-date-time-picker.component';
import { AmazingTimePickerService } from 'amazing-time-picker';

describe('LessonDateTimePickerComponent', () => {
  let component: LessonDateTimePickerComponent;
  let fixture: ComponentFixture<LessonDateTimePickerComponent>;

  beforeEach(async(() => {
    const amazingTimePickerServiceSpy = jasmine.createSpyObj<AmazingTimePickerService>(['open']);
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ LessonDateTimePickerComponent ],
      providers: [
        { provide: AmazingTimePickerService, useValue: amazingTimePickerServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
