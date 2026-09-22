const MARKS_STORAGE_KEY = 'campus_marks_data';

const DEFAULT_MOCK_MARKS = [
  // Computer Science Student (STU-1001 - Alex Johnson)
  {
    id: 'mark-1',
    studentId: 'STU-1001',
    studentName: 'Alex Johnson',
    department: 'Computer Science',
    courseCode: 'CS101',
    courseName: 'Introduction to Programming',
    semester: 'Semester 1',
    examType: 'Semester Final',
    maxMarks: 100,
    marksObtained: 92,
    grade: 'A+',
    remarks: 'Outstanding algorithmic logic and clean code syntax.',
    updatedAt: '2026-09-15',
  },
  {
    id: 'mark-2',
    studentId: 'STU-1001',
    studentName: 'Alex Johnson',
    department: 'Computer Science',
    courseCode: 'CS204',
    courseName: 'Data Structures and Algorithms',
    semester: 'Semester 3',
    examType: 'Semester Final',
    maxMarks: 100,
    marksObtained: 88,
    grade: 'A',
    remarks: 'Strong grasp of tree traversals and graph algorithms.',
    updatedAt: '2026-09-16',
  },
  {
    id: 'mark-3',
    studentId: 'STU-1001',
    studentName: 'Alex Johnson',
    department: 'Computer Science',
    courseCode: 'CS302',
    courseName: 'Database Management Systems',
    semester: 'Semester 5',
    examType: 'Midterm Exam',
    maxMarks: 100,
    marksObtained: 95,
    grade: 'A+',
    remarks: 'Excellent SQL optimization and schema design normalization.',
    updatedAt: '2026-09-20',
  },
  {
    id: 'mark-4',
    studentId: 'STU-1001',
    studentName: 'Alex Johnson',
    department: 'Computer Science',
    courseCode: 'EE201',
    courseName: 'Circuit Analysis',
    semester: 'Semester 2',
    examType: 'Semester Final',
    maxMarks: 100,
    marksObtained: 82,
    grade: 'A-',
    remarks: 'Good analytical calculations and lab work.',
    updatedAt: '2026-09-10',
  },
  {
    id: 'mark-5',
    studentId: 'STU-1001',
    studentName: 'Alex Johnson',
    department: 'Computer Science',
    courseCode: 'MA102',
    courseName: 'Calculus II & Differential Equations',
    semester: 'Semester 2',
    examType: 'Semester Final',
    maxMarks: 100,
    marksObtained: 98,
    grade: 'A+',
    remarks: 'Exceptional score in multivariable integration.',
    updatedAt: '2026-09-12',
  },

  // Computer Science Student (STU-1005 - David Wilson)
  {
    id: 'mark-6',
    studentId: 'STU-1005',
    studentName: 'David Wilson',
    department: 'Computer Science',
    courseCode: 'CS101',
    courseName: 'Introduction to Programming',
    semester: 'Semester 1',
    examType: 'Semester Final',
    maxMarks: 100,
    marksObtained: 76,
    grade: 'B+',
    remarks: 'Solid grasp of core fundamentals, practice pointers.',
    updatedAt: '2026-09-15',
  },
  {
    id: 'mark-7',
    studentId: 'STU-1005',
    studentName: 'David Wilson',
    department: 'Computer Science',
    courseCode: 'CS204',
    courseName: 'Data Structures and Algorithms',
    semester: 'Semester 3',
    examType: 'Midterm Exam',
    maxMarks: 100,
    marksObtained: 81,
    grade: 'A-',
    remarks: 'Good performance in sorting techniques.',
    updatedAt: '2026-09-20',
  },

  // Electrical Eng Student (STU-1002 - Sophia Martinez)
  {
    id: 'mark-8',
    studentId: 'STU-1002',
    studentName: 'Sophia Martinez',
    department: 'Electrical Eng',
    courseCode: 'EE201',
    courseName: 'Circuit Analysis',
    semester: 'Semester 2',
    examType: 'Semester Final',
    maxMarks: 100,
    marksObtained: 96,
    grade: 'A+',
    remarks: 'Top rank in circuit simulations and network theorems.',
    updatedAt: '2026-09-18',
  },
];

function getStoredMarks() {
  const stored = localStorage.getItem(MARKS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(MARKS_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_MARKS));
  return DEFAULT_MOCK_MARKS;
}

function saveStoredMarks(marks) {
  localStorage.setItem(MARKS_STORAGE_KEY, JSON.stringify(marks));
}

export function calculateGrade(marks) {
  const m = Number(marks);
  if (m >= 90) return 'A+';
  if (m >= 80) return 'A';
  if (m >= 75) return 'A-';
  if (m >= 70) return 'B+';
  if (m >= 60) return 'B';
  if (m >= 50) return 'C';
  if (m >= 40) return 'D';
  return 'F';
}

export const marksService = {
  // Get all marks matching filters
  async getMarks(params = {}) {
    let list = getStoredMarks();
    if (params.studentId) {
      list = list.filter(
        (m) => m.studentId.toLowerCase() === params.studentId.toLowerCase()
      );
    }
    if (params.department && params.department !== 'ALL') {
      list = list.filter((m) => m.department === params.department);
    }
    if (params.courseCode && params.courseCode !== 'ALL') {
      list = list.filter((m) => m.courseCode === params.courseCode);
    }
    if (params.examType && params.examType !== 'ALL') {
      list = list.filter((m) => m.examType === params.examType);
    }
    return list;
  },

  // Save single student mark
  async saveStudentMark(payload) {
    const list = getStoredMarks();
    const grade = calculateGrade(payload.marksObtained);
    
    // Check if record exists for same student, course, and exam
    const existingIndex = list.findIndex(
      (m) =>
        m.studentId === payload.studentId &&
        m.courseCode === payload.courseCode &&
        m.examType === payload.examType
    );

    let updatedRecord;
    if (existingIndex >= 0) {
      updatedRecord = {
        ...list[existingIndex],
        ...payload,
        grade,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      list[existingIndex] = updatedRecord;
    } else {
      updatedRecord = {
        ...payload,
        id: `mark-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        grade,
        maxMarks: payload.maxMarks || 100,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      list.unshift(updatedRecord);
    }

    saveStoredMarks(list);
    return updatedRecord;
  },

  // Batch save marks for a class
  async saveBulkMarks(marksArray) {
    const list = getStoredMarks();
    
    marksArray.forEach((payload) => {
      const grade = calculateGrade(payload.marksObtained);
      const existingIndex = list.findIndex(
        (m) =>
          m.studentId === payload.studentId &&
          m.courseCode === payload.courseCode &&
          m.examType === payload.examType
      );

      if (existingIndex >= 0) {
        list[existingIndex] = {
          ...list[existingIndex],
          ...payload,
          grade,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      } else {
        list.unshift({
          ...payload,
          id: `mark-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          grade,
          maxMarks: payload.maxMarks || 100,
          updatedAt: new Date().toISOString().split('T')[0],
        });
      }
    });

    saveStoredMarks(list);
    return true;
  },
};

