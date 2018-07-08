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
      start: new Date(2018, 6, 9, 0, 0), 
      color: {
        primary: '',
        secondary: '#8e24aa' //This would create work if the theme needs to be changed, but the calendar component doesn't allow pure-css event styling
      },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    },     
    {
      title: 'Today event',
      start: new Date(), 
      color: {
        primary: '',
        secondary: '#8e24aa' //This would create work if the theme needs to be changed, but the calendar component doesn't allow pure-css event styling
      },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
