import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAttendeeDetailComponent } from './lesson-attendee-detail.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { Student } from '../../../model/student';

describe('LessonAttendeeDetailComponent', () => {
  let component: LessonAttendeeDetailComponent;
  let fixture: ComponentFixture<LessonAttendeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
      ],
      declarations: [ LessonAttendeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonAttendeeDetailComponent);
    component = fixture.componentInstance;
    component.student = new Student();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
