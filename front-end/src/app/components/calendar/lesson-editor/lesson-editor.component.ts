import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.scss']
})
export class LessonEditorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LessonEditorComponent>,
  @Optional()  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
