import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { AppMaterialModule } from '../../../modules/app-material.module';

import { LessonRepeaterComponent } from './lesson-repeater.component';


describe('LessonRepeaterComponent', () => {
  let component: LessonRepeaterComponent;
  let fixture: ComponentFixture<LessonRepeaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        AppMaterialModule
      ],
      declarations: [ LessonRepeaterComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonRepeaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
