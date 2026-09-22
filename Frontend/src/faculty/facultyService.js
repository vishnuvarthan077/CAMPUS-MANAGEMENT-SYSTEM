import { request, toQueryString } from '../api/client';

export const facultyService = {
  async getFaculty(params = {}) {
    const query = {};
    if (params.department && params.department !== 'ALL') query.department = params.department;
    if (params.search) query.search = params.search;
    if (params.page) query.page = params.page;
    if (params.limit) query.limit = params.limit;

    const res = await request(`/faculty${toQueryString(query)}`);
    return res.data;
  },

  async getFacultyById(id) {
    const res = await request(`/faculty/${id}`);
    return res.data;
  },

  // Creates the underlying User account (role: faculty) and the linked Faculty
  // profile in one step, since the backend models them as two related records.
  async createFaculty(payload) {
    const userRes = await request('/users', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: 'faculty',
        phone: payload.phone || undefined,
      }),
    });

    const facultyRes = await request('/faculty', {
      method: 'POST',
      body: JSON.stringify({
        userId: userRes.data.id,
        employeeId: payload.employeeId,
        department: payload.department,
        designation: payload.designation,
        qualification: payload.qualification || undefined,
        specialization: payload.specialization || undefined,
        officeLocation: payload.officeLocation || undefined,
      }),
    });

    return facultyRes.data;
  },

  async updateFaculty(id, payload) {
    const res = await request(`/faculty/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        employeeId: payload.employeeId,
        department: payload.department,
        designation: payload.designation,
        qualification: payload.qualification,
        specialization: payload.specialization,
        officeLocation: payload.officeLocation,
      }),
    });
    return res.data;
  },

  async deleteFaculty(id) {
    await request(`/faculty/${id}`, { method: 'DELETE' });
    return true;
  },

  getStats(faculty = []) {
    const total = faculty.length;
    const professors = faculty.filter(
      (f) => f.designation && f.designation.toLowerCase().includes('professor')
    ).length;
    const departmentsCount = new Set(faculty.map((f) => f.department?._id).filter(Boolean)).size;

    return { total, professors, departmentsCount };
  },
};
