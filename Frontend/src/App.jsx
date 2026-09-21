import { useState } from 'react'
import DepartmentsPage from './pages/DepartmentsPage'
import CoursesPage from './pages/CoursesPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('departments')

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Campus Management System</h1>
        <nav className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'departments' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            Departments
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'courses' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'departments' ? <DepartmentsPage /> : <CoursesPage />}
      </main>
    </div>
  )
}

export default App
