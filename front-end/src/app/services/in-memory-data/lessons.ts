import { Lesson } from '../../model/lesson';
import { students } from './students';
import { parse, format } from 'date-fns';

export const lessons: Lesson[] = [{
    id: 1,
    date: new Date(2018, 7, 8, 10, 0),
    startTime: '10:00',
    endTime: '11:00',
    attendees: [{
        student: students[0],
        hasAttended: true,
        hasPaid: true,
        price: 300
    }],
    status: 'active',
  }, {
    id: 2,
    date: parse(format(new Date(), 'YYYY-MM-DD 15:00')),
    startTime: '15:00',
    endTime: '16:00',
    attendees: [{
      student: students[0],
      hasAttended: false,
      hasPaid: false,
      price: 240
    }, {
      student: students[1],
      hasAttended: true,
      hasPaid: false,
      price: 240
    }],
    status: 'active'
  }, {
    id: 3,
    date: new Date(2018, 7, 5, 11, 15),
    startTime: '11:15',
    endTime: '12:30',
    attendees: [{
      student: students[2],
      hasAttended: false,
      hasPaid: false,
      price: 190
    }, {
      student: students[3],
      hasAttended: false,
      hasPaid: true,
      price: 171
    }, {
      student: students[4],
      hasAttended: false,
      hasPaid: false,
      price: 190
    }],
    status: 'active'
  }, {
    id: 4,
    date: new Date(2018, 7, 1, 16, 0),
    startTime: '16:00',
    endTime: '17:00',
    attendees: [{
        student: students[5],
        hasAttended: false,
        hasPaid: true,
        price: 270
    }],
    status: 'cancelled',
  }
];
