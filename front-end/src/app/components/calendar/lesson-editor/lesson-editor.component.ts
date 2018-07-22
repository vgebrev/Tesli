import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lesson } from '../../../models/lesson';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.scss']
})
export class LessonEditorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LessonEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public lesson: Lesson) {
  }

  ngOnInit() {
  }
}
