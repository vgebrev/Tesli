import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  view: string = 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      title: 'An event',
      start: new Date(),
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      }
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
