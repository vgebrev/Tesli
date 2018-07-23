import { Component, OnInit, Input } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'lesson-date-time-picker',
  templateUrl: './lesson-date-time-picker.component.html',
  styleUrls: ['./lesson-date-time-picker.component.scss']
})
export class LessonDateTimePickerComponent implements OnInit {

  @Input() date: Date;
  @Input() startTime: string;
  @Input() endTime: string;
  private lessonDateTimeForm: FormGroup;

  constructor(
    private timePickerService: AmazingTimePickerService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.lessonDateTimeForm = this.formBuilder.group({
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime
    });
  }

  open(selectedTime) {
    const timePicker = this.timePickerService.open({
      time:  selectedTime === 'start' ? this.startTime : this.endTime,
      theme: 'dark',
      preference: {
        labels: {
          ok: 'OK'
        }
      }
    });
    timePicker.afterClose().subscribe(time => this.lessonDateTimeForm.controls[`${selectedTime}Time`].setValue(time));
  }
}
