import { Student } from './student';

export class LessonAttendee {
    id: number;
    lessonId: number;
    studentId: number;
    student: Student;
    hasAttended: boolean;
    hasPaid: boolean;
    price: number;
}
