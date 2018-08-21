import { Lesson } from '../../model/lesson';
import { students } from './students';
import { parse, format } from 'date-fns';

export const lessons: Lesson[] = [{
    id: 1,
    date: new Date(2018, 7, 8, 10, 0),
    startTime: '10:00',
    endTime: '11:00',
    lessonAttendees: [{
        id: 1,
        lessonId: 1,
        studentId: students[0].id,
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
    lessonAttendees: [{
      id: 2,
      lessonId: 2,
      studentId: students[0].id,
      student: students[0],
      hasAttended: false,
      hasPaid: false,
      price: 240
    }, {
      id: 3,
      lessonId: 2,
      studentId: students[1].id,
      student: students[1],
      hasAttended: true,
      hasPaid: false,
      price: 240
    }],
    status: 'active'
  }, {
    id: 3,
    date: new Date(2018, 7, 7, 11, 15),
    startTime: '11:15',
    endTime: '12:30',
    lessonAttendees: [{
      id: 4,
      lessonId: 3,
      studentId: students[2].id,
      student: students[2],
      hasAttended: false,
      hasPaid: false,
      price: 190
    }, {
      id: 5,
      lessonId: 3,
      studentId: students[3].id,
      student: students[3],
      hasAttended: false,
      hasPaid: true,
      price: 171
    }, {
      id: 6,
      lessonId: 3,
      studentId: students[4].id,
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
    lessonAttendees: [{
      id: 7,
      lessonId: 4,
      studentId: students[5].id,
      student: students[5],
      hasAttended: false,
      hasPaid: true,
      price: 270
    }],
    status: 'cancelled',
  }
];
