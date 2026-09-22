import { request, toQueryString } from '../api/client';

const STORAGE_KEY = 'campus_faculty_data';

const DEFAULT_MOCK_FACULTY = [
  {
    _id: 'fac-1',
    facultyId: 'FAC-01',
    name: 'Dr. Alan Turing',
    email: 'a.turing@campus.edu',
    phone: '+1 (555) 901-2345',
    department: 'Computer Science',
    designation: 'Professor & Chair',
    specialization: 'Theory of Computation & Artificial Intelligence',
    qualification: 'Ph.D. in Computer Science',
    officeRoom: 'Tech Block 401',
    status: 'Active',
    joiningYear: 2015,
  },
  {
    _id: 'fac-2',
    facultyId: 'FAC-02',
    name: 'Dr. Marie Curie',
    email: 'm.curie@campus.edu',
    phone: '+1 (555) 912-3456',
    department: 'Physics',
    designation: 'Head of Department',
    specialization: 'Nuclear Physics & Applied Chemistry',
    qualification: 'Ph.D. in Physics & Radiochemistry',
    officeRoom: 'Science Center 204',
    status: 'Active',
    joiningYear: 2012,
  },
  {
    _id: 'fac-3',
    facultyId: 'FAC-03',
    name: 'Prof. Nikola Tesla',
    email: 'n.tesla@campus.edu',
    phone: '+1 (555) 923-4567',
    department: 'Electrical Eng',
    designation: 'Associate Professor',
    specialization: 'AC Power Transmission & Electromagnetics',
    qualification: 'M.S. in Electrical Engineering',
    officeRoom: 'Engineering Hall 108',
    status: 'Active',
    joiningYear: 2018,
  },
  {
    _id: 'fac-4',
    facultyId: 'FAC-04',
    name: 'Dr. Ada Lovelace',
    email: 'a.lovelace@campus.edu',
    phone: '+1 (555) 934-5678',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Algorithmic Architectures & Programming Systems',
    qualification: 'Ph.D. in Mathematical Computing',
    officeRoom: 'Tech Block 412',
    status: 'Active',
    joiningYear: 2016,
  },
  {
    _id: 'fac-5',
    facultyId: 'FAC-05',
    name: 'Dr. James Watt',
    email: 'j.watt@campus.edu',
    phone: '+1 (555) 945-6789',
    department: 'Mechanical Eng',
    designation: 'Professor',
    specialization: 'Thermodynamics & Energy Conversion Systems',
    qualification: 'Ph.D. in Mechanical Engineering',
    officeRoom: 'Mech Lab 302',
    status: 'Active',
    joiningYear: 2014,
  },
  {
    _id: 'fac-6',
    facultyId: 'FAC-06',
    name: 'Dr. Arthur Casagrande',
    email: 'a.casagrande@campus.edu',
    phone: '+1 (555) 956-7890',
    department: 'Civil Eng',
    designation: 'Assistant Professor',
    specialization: 'Geotechnical & Structural Foundations',
    qualification: 'Ph.D. in Civil Engineering',
    officeRoom: 'Civil Complex 115',
    status: 'On Leave',
    joiningYear: 2020,
  },
];

function getLocalFaculty() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_FACULTY));
  return DEFAULT_MOCK_FACULTY;
}

function setLocalFaculty(faculty) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(faculty));
}

export const facultyService = {
  async getFaculty(params = {}) {
    try {
      const res = await request(`/faculty${toQueryString(params)}`);
      if (res && res.data) {
        return res.data;
      }
      throw new Error('No data from API');
    } catch {
      // Local fallback
      let list = getLocalFaculty();
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.facultyId.toLowerCase().includes(q) ||
            f.email.toLowerCase().includes(q) ||
            (f.specialization && f.specialization.toLowerCase().includes(q))
        );
      }
      if (params.department && params.department !== 'ALL') {
        list = list.filter((f) => f.department === params.department);
      }
      if (params.designation && params.designation !== 'ALL') {
        list = list.filter((f) => f.designation === params.designation);
      }
      if (params.status && params.status !== 'ALL') {
        list = list.filter((f) => f.status === params.status);
      }
      return list;
    }
  },

  async getFacultyById(id) {
    try {
      const res = await request(`/faculty/${id}`);
      return res.data;
    } catch {
      const list = getLocalFaculty();
      return list.find((f) => f._id === id || f.facultyId === id) || null;
    }
  },

  async createFaculty(payload) {
    try {
      const res = await request('/faculty', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    } catch {
      const list = getLocalFaculty();
      const newFaculty = {
        ...payload,
        _id: `fac-${Date.now()}`,
        facultyId: payload.facultyId || `FAC-0${list.length + 1}`,
        status: payload.status || 'Active',
        joiningYear: payload.joiningYear ? Number(payload.joiningYear) : new Date().getFullYear(),
      };
      const updated = [newFaculty, ...list];
      setLocalFaculty(updated);
      return newFaculty;
    }
  },

  async updateFaculty(id, payload) {
    try {
      const res = await request(`/faculty/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return res.data;
    } catch {
      const list = getLocalFaculty();
      const updated = list.map((f) =>
        f._id === id || f.facultyId === id ? { ...f, ...payload } : f
      );
      setLocalFaculty(updated);
      return updated.find((f) => f._id === id || f.facultyId === id);
    }
  },

  async deleteFaculty(id) {
    try {
      await request(`/faculty/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      const list = getLocalFaculty();
      const updated = list.filter((f) => f._id !== id && f.facultyId !== id);
      setLocalFaculty(updated);
      return true;
    }
  },

  getStats(faculty = []) {
    const list = faculty.length > 0 ? faculty : getLocalFaculty();
    const total = list.length;
    const active = list.filter((f) => f.status === 'Active').length;
    const professors = list.filter((f) => f.designation && f.designation.includes('Professor')).length;
    const departmentsCount = new Set(list.map((f) => f.department)).size;

    return {
      total,
      active,
      professors,
      departmentsCount,
    };
  },
};

