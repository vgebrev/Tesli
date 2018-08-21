import { LessonAttendee } from './lesson-attendee';

export class Lesson {
    id: number;
    date: Date;
    startTime: string;
    endTime: string;
    lessonAttendees: LessonAttendee[];
    status: 'active' | 'cancelled';
}
