import { request, toQueryString } from '../api/client';

const STORAGE_KEY = 'campus_students_data';

const DEFAULT_MOCK_STUDENTS = [
  {
    _id: 'stu-1',
    studentId: 'STU-1001',
    name: 'Alex Johnson',
    email: 'alex.j@campus.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    gpa: 3.85,
    status: 'Enrolled',
    admissionDate: '2023-08-15',
  },
  {
    _id: 'stu-2',
    studentId: 'STU-1002',
    name: 'Sophia Martinez',
    email: 'sophia.m@campus.edu',
    phone: '+1 (555) 345-6789',
    department: 'Electrical Eng',
    year: '2nd Year',
    semester: 'Semester 3',
    gpa: 3.92,
    status: 'Enrolled',
    admissionDate: '2024-08-20',
  },
  {
    _id: 'stu-3',
    studentId: 'STU-1003',
    name: 'Michael Chang',
    email: 'm.chang@campus.edu',
    phone: '+1 (555) 456-7890',
    department: 'Mechanical Eng',
    year: '4th Year',
    semester: 'Semester 7',
    gpa: 3.70,
    status: 'Enrolled',
    admissionDate: '2022-08-10',
  },
  {
    _id: 'stu-4',
    studentId: 'STU-1004',
    name: 'Emily Davis',
    email: 'emily.d@campus.edu',
    phone: '+1 (555) 567-8901',
    department: 'Civil Eng',
    year: '1st Year',
    semester: 'Semester 1',
    gpa: 3.65,
    status: 'Enrolled',
    admissionDate: '2025-08-18',
  },
  {
    _id: 'stu-5',
    studentId: 'STU-1005',
    name: 'David Wilson',
    email: 'd.wilson@campus.edu',
    phone: '+1 (555) 678-9012',
    department: 'Computer Science',
    year: '2nd Year',
    semester: 'Semester 4',
    gpa: 3.42,
    status: 'Enrolled',
    admissionDate: '2024-08-20',
  },
  {
    _id: 'stu-6',
    studentId: 'STU-1006',
    name: 'Olivia Brown',
    email: 'olivia.b@campus.edu',
    phone: '+1 (555) 789-0123',
    department: 'Mathematics',
    year: '3rd Year',
    semester: 'Semester 6',
    gpa: 3.96,
    status: 'Enrolled',
    admissionDate: '2023-08-15',
  },
];

// Helper to get cached mock items from localStorage
function getLocalStudents() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_STUDENTS));
  return DEFAULT_MOCK_STUDENTS;
}

function setLocalStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export const studentService = {
  // Get all students with optional backend API or localStorage fallback
  async getStudents(params = {}) {
    try {
      const res = await request(`/students${toQueryString(params)}`);
      if (res && res.data) {
        return res.data;
      }
      throw new Error('No data');
    } catch {
      // Seamless frontend fallback
      let list = getLocalStudents();
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.studentId.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        );
      }
      if (params.department && params.department !== 'ALL') {
        list = list.filter((s) => s.department === params.department);
      }
      if (params.year && params.year !== 'ALL') {
        list = list.filter((s) => s.year === params.year);
      }
      if (params.status && params.status !== 'ALL') {
        list = list.filter((s) => s.status === params.status);
      }
      return list;
    }
  },

  async getStudentById(id) {
    try {
      const res = await request(`/students/${id}`);
      return res.data;
    } catch {
      const list = getLocalStudents();
      return list.find((s) => s._id === id || s.studentId === id) || null;
    }
  },

  async createStudent(payload) {
    try {
      const res = await request('/students', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    } catch {
      const list = getLocalStudents();
      const newStudent = {
        ...payload,
        _id: `stu-${Date.now()}`,
        studentId: payload.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        gpa: payload.gpa ? Number(payload.gpa) : 3.5,
        status: payload.status || 'Enrolled',
        admissionDate: payload.admissionDate || new Date().toISOString().split('T')[0],
      };
      const updated = [newStudent, ...list];
      setLocalStudents(updated);
      return newStudent;
    }
  },

  async updateStudent(id, payload) {
    try {
      const res = await request(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return res.data;
    } catch {
      const list = getLocalStudents();
      const updated = list.map((s) =>
        s._id === id || s.studentId === id
          ? { ...s, ...payload, gpa: payload.gpa ? Number(payload.gpa) : s.gpa }
          : s
      );
      setLocalStudents(updated);
      return updated.find((s) => s._id === id || s.studentId === id);
    }
  },

  async deleteStudent(id) {
    try {
      await request(`/students/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      const list = getLocalStudents();
      const updated = list.filter((s) => s._id !== id && s.studentId !== id);
      setLocalStudents(updated);
      return true;
    }
  },

  // Calculate statistics
  getStats(students = []) {
    const list = students.length > 0 ? students : getLocalStudents();
    const total = list.length;
    const enrolled = list.filter((s) => s.status === 'Enrolled').length;
    const avgGpa =
      total > 0
        ? (list.reduce((acc, curr) => acc + (Number(curr.gpa) || 0), 0) / total).toFixed(2)
        : '0.00';
    const departmentsCount = new Set(list.map((s) => s.department)).size;

    return {
      total,
      enrolled,
      avgGpa,
      departmentsCount,
    };
  },
};

