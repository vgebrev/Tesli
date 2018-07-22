import { Component, OnInit, Input } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'lesson-date-time-picker',
  templateUrl: './lesson-date-time-picker.component.html',
  styleUrls: ['./lesson-date-time-picker.component.scss']
})
export class LessonDateTimePickerComponent implements OnInit {

  @Input() date: Date;
  @Input() startTime: string;
  @Input() endTime: string;

  constructor(private timePickerService: AmazingTimePickerService) { }

  ngOnInit() {
  }

  open(selectedTime) {
    const timePicker = this.timePickerService.open({
      time:  selectedTime,
      theme: 'dark',
      preference: {
        labels: {
          ok: 'OK'
        }
      }
    });
    timePicker.afterClose().subscribe(time => {
      selectedTime = time;
    });
  }
}
