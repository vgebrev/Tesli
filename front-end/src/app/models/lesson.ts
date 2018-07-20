import { LessonAttendee } from './lesson-attendee';

export class Lesson {
    date: Date;
    startTime: string; // TODO: better typing for time data
    endTime: string;
    attendees: LessonAttendee[];
    status: 'active' | 'cancelled';
}
