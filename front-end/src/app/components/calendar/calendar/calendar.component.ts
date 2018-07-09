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
      start: new Date(2018, 6, 8, 0, 0), 
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    },     
    {
      title: 'Today event',
      start: new Date(), 
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
