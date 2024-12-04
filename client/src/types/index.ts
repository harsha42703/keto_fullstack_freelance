export interface User {
  id: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT" | "ADMIN" | "PARENT";
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  schedule: string[];
  students: string[];
  description?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  status: "PENDING" | "SUBMITTED" | "GRADED";
  grade?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
