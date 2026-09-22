import { request, toQueryString } from '../api/client';

export const studentService = {
  async getStudents(params = {}) {
    const query = {};
    if (params.department && params.department !== 'ALL') query.department = params.department;
    if (params.semester && params.semester !== 'ALL') query.semester = params.semester;
    if (params.search) query.search = params.search;
    if (params.page) query.page = params.page;
    if (params.limit) query.limit = params.limit;

    const res = await request(`/students${toQueryString(query)}`);
    return res.data;
  },

  async getStudentById(id) {
    const res = await request(`/students/${id}`);
    return res.data;
  },

  // Creates the underlying User account (role: student) and the linked Student
  // profile in one step, since the backend models them as two related records.
  async createStudent(payload) {
    const userRes = await request('/users', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: 'student',
        phone: payload.phone || undefined,
      }),
    });

    const studentRes = await request('/students', {
      method: 'POST',
      body: JSON.stringify({
        userId: userRes.data.id,
        rollNumber: payload.rollNumber,
        department: payload.department,
        semester: payload.semester ? Number(payload.semester) : 1,
        batch: payload.batch || undefined,
        dateOfBirth: payload.dateOfBirth || undefined,
        gender: payload.gender || undefined,
        address: payload.address || undefined,
        guardianName: payload.guardianName || undefined,
        guardianPhone: payload.guardianPhone || undefined,
      }),
    });

    return studentRes.data;
  },

  async updateStudent(id, payload) {
    const res = await request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        rollNumber: payload.rollNumber,
        department: payload.department,
        semester: payload.semester ? Number(payload.semester) : undefined,
        batch: payload.batch,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
        address: payload.address,
        guardianName: payload.guardianName,
        guardianPhone: payload.guardianPhone,
      }),
    });
    return res.data;
  },

  async deleteStudent(id) {
    await request(`/students/${id}`, { method: 'DELETE' });
    return true;
  },

  getStats(students = []) {
    const total = students.length;
    const departmentsCount = new Set(students.map((s) => s.department?._id).filter(Boolean)).size;
    const avgSemester = total
      ? (students.reduce((acc, s) => acc + (s.semester || 0), 0) / total).toFixed(1)
      : 0;

    return { total, departmentsCount, avgSemester };
  },
};
