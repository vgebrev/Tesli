import { Student } from './student';

export class LessonAttendee {
    id: number;
    student: Student;
    hasAttended: boolean;
    hasPaid: boolean;
    price: number;
}
