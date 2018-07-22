import { LessonAttendee } from './lesson-attendee';

export class Lesson {
    id: number;
    date: Date;
    startTime: string; // TODO: better typing for time data
    endTime: string;
    attendees: LessonAttendee[];
    status: 'active' | 'cancelled';
}
