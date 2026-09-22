import { useState } from 'react'
import DepartmentsPage from './pages/DepartmentsPage'
import CoursesPage from './pages/CoursesPage'
import NoticeboardPage from './pages/NoticeboardPage'
import PlacementsPage from './pages/PlacementsPage'
import AlumniPage from './pages/AlumniPage'
import './App.css'

const TABS = [
  { id: 'departments', label: 'Departments', Component: DepartmentsPage },
  { id: 'courses', label: 'Courses', Component: CoursesPage },
  { id: 'noticeboard', label: 'Noticeboard', Component: NoticeboardPage },
  { id: 'placements', label: 'Placements', Component: PlacementsPage },
  { id: 'alumni', label: 'Alumni', Component: AlumniPage },
]

function App() {
  const [activeTab, setActiveTab] = useState('departments')
  const ActiveComponent = TABS.find((tab) => tab.id === activeTab).Component

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Campus Management System</h1>
        <nav className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <ActiveComponent />
      </main>
    </div>
  )
}

export default App
