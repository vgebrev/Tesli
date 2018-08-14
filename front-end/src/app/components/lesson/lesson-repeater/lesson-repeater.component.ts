import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-lesson-repeater',
  templateUrl: './lesson-repeater.component.html',
  styleUrls: ['./lesson-repeater.component.scss']
})
export class LessonRepeaterComponent implements OnInit {

  repeatCount = 1;
  repeatInterval = 7;

  constructor(public dialogRef: MatDialogRef<LessonRepeaterComponent>) { }

  ngOnInit() {
  }
}
