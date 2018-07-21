import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Lesson } from '../../../models/lesson';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.scss']
})
export class LessonEditorComponent implements OnInit {

  private lesson: Lesson;
  constructor(
    public dialogRef: MatDialogRef<LessonEditorComponent>,
    private timePickerService: AmazingTimePickerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.lesson = data.lesson;
  }

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
