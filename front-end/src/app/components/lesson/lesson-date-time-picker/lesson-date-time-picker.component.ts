import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { CustomValidators } from '../../../validators/custom-validators';

@Component({
  selector: 'lesson-date-time-picker',
  templateUrl: './lesson-date-time-picker.component.html',
  styleUrls: ['./lesson-date-time-picker.component.scss']
})
export class LessonDateTimePickerComponent implements OnInit {

  @Input() date: Date;
  @Input() startTime: string;
  @Input() endTime: string;
  @Output() dateTimeChange: EventEmitter<any> = new EventEmitter();
  lessonDateTimeForm: FormGroup;
  isValid: boolean;

  constructor(
    private timePickerService: AmazingTimePickerService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.lessonDateTimeForm = this.formBuilder.group({
      date: this.date,
      startTime: [this.startTime, CustomValidators.time],
      endTime: [this.endTime, CustomValidators.time]
    }, { validator: CustomValidators.timeOrder });
    this.isValid = this.lessonDateTimeForm.valid;
  }

  openTimePicker(formControlName) {
    const control = this.lessonDateTimeForm.controls[formControlName];
    const timePicker = this.timePickerService.open({
      time: control.value,
      theme: 'dark',
      preference: {
        labels: {
          ok: 'OK'
        }
      }
    });
    timePicker.afterClose().subscribe(time => { control.setValue(time); this.onFormChanged(); });
  }

  onFormChanged() {
    Object.keys(this.lessonDateTimeForm.controls).forEach(control => this.lessonDateTimeForm.get(control).markAsDirty());
    this.isValid = this.lessonDateTimeForm.valid;
    if (this.isValid) {
      this.dateTimeChange.emit(this.lessonDateTimeForm.value);
    }
  }

  hasError(controlName: string, error: string) {
    return this.lessonDateTimeForm.get(controlName).hasError(error);
  }
}
