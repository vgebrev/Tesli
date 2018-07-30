import { LessonAttendee } from './lesson-attendee';

export class Lesson {
    id: number;
    date: Date;
    startTime: string;
    endTime: string;
    attendees: LessonAttendee[];
    status: 'active' | 'cancelled';
}
