const REGISTERED_USERS_KEY = 'campus_registered_users';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'System Administrator',
    email: 'admin@campus.edu',
    password: 'password',
    role: 'admin',
    registerNumber: 'ADM-001',
    department: 'Administration',
  },
  {
    id: 'user-student',
    name: 'Alex Johnson',
    email: 'student@campus.edu',
    password: 'password',
    role: 'student',
    registerNumber: 'STU-1001',
    department: 'Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    gpa: 3.85,
    phone: '+1 (555) 234-5678',
    admissionDate: '2023-08-15',
  },
  {
    id: 'user-faculty',
    name: 'Dr. Alan Turing',
    email: 'faculty@campus.edu',
    password: 'password',
    role: 'faculty',
    registerNumber: 'FAC-01',
    department: 'Computer Science',
  },
];

function getRegisteredUsers() {
  const stored = localStorage.getItem(REGISTERED_USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
}

function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export const authService = {
  // Login user and return user object with their exact role & student profile details
  async login(credentials) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Please enter both email and password.');
    }

    const email = credentials.email.trim().toLowerCase();
    const users = getRegisteredUsers();
    
    // Find user in registered list
    let matchedUser = users.find((u) => u.email.toLowerCase() === email);

    // If not found in registered accounts, create a realistic profile based on email/role
    if (!matchedUser) {
      let inferredRole = 'student';
      if (email.includes('admin')) inferredRole = 'admin';
      else if (email.includes('faculty') || email.includes('prof') || email.includes('dr.')) inferredRole = 'faculty';

      const userName = credentials.email.split('@')[0]
        .split(/[._-]/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Campus User';

      matchedUser = {
        id: `user-${Date.now()}`,
        name: userName,
        email: credentials.email,
        password: credentials.password,
        role: inferredRole,
        registerNumber: inferredRole === 'student' ? `STU-${Math.floor(1000 + Math.random() * 9000)}` : `FAC-0${Math.floor(1 + Math.random() * 9)}`,
        department: 'Computer Science',
        year: '1st Year',
        semester: 'Semester 1',
        gpa: 3.75,
      };

      // Add to registered list
      saveRegisteredUsers([...users, matchedUser]);
    }

    const sessionUser = {
      id: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role || 'student',
      registerNumber: matchedUser.registerNumber || 'STU-1001',
      department: matchedUser.department || 'Computer Science',
      year: matchedUser.year || '1st Year',
      semester: matchedUser.semester || 'Semester 1',
      gpa: matchedUser.gpa || 3.75,
      phone: matchedUser.phone || '+1 (555) 019-2834',
      admissionDate: matchedUser.admissionDate || new Date().toISOString().split('T')[0],
    };

    // Clear stale items from both storages first
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    // Store in sessionStorage by default, or localStorage if rememberMe is selected
    const storage = credentials.rememberMe ? localStorage : sessionStorage;
    const tokenVal = 'jwt-mock-token-' + Date.now();

    storage.setItem(TOKEN_KEY, tokenVal);
    storage.setItem(USER_KEY, JSON.stringify(sessionUser));

    return {
      token: tokenVal,
      user: sessionUser,
    };
  },

  // Register user and persist their Register Number, Department, and Role
  async register(userData) {
    if (!userData.email || !userData.password || !userData.name || !userData.registerNumber || !userData.department) {
      throw new Error('Please fill in all mandatory fields including Register Number and Department.');
    }

    const email = userData.email.trim().toLowerCase();
    const users = getRegisteredUsers();

    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: email,
      password: userData.password,
      role: userData.role || 'student',
      registerNumber: userData.registerNumber.trim().toUpperCase(),
      department: userData.department,
      year: userData.year || '1st Year',
      semester: userData.semester || 'Semester 1',
      gpa: userData.gpa ? Number(userData.gpa) : 3.75,
      phone: userData.phone || '+1 (555) 000-0000',
      admissionDate: new Date().toISOString().split('T')[0],
    };

    saveRegisteredUsers([...users, newUser]);

    return {
      success: true,
      user: newUser,
    };
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  getCurrentUser() {
    const userJson = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  },
};
