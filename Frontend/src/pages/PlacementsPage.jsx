import { useEffect, useState } from 'react'
import { getDrives, createDrive, updateDrive, deleteDrive } from '../api/driveApi'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../api/companyApi'
import {
  getPlacements,
  getPlacementStats,
  createPlacement,
  updatePlacement,
  deletePlacement,
} from '../api/placementApi'
import { getDepartments } from '../api/departmentApi'
import StatsBar from '../components/placements/StatsBar'
import DriveBoard from '../components/placements/DriveBoard'
import DriveForm from '../components/placements/DriveForm'
import CompanyGrid from '../components/placements/CompanyGrid'
import CompanyForm from '../components/placements/CompanyForm'
import PlacementLeaderboard from '../components/placements/PlacementLeaderboard'
import PlacementForm from '../components/placements/PlacementForm'
import Modal from '../components/Modal'

const SUB_VIEWS = [
  { id: 'drives', label: 'Drive Pipeline' },
  { id: 'companies', label: 'Companies' },
  { id: 'placements', label: 'Placed Students' },
]

function PlacementsPage() {
  const [subView, setSubView] = useState('drives')
  const [stats, setStats] = useState({})
  const [drives, setDrives] = useState([])
  const [companies, setCompanies] = useState([])
  const [departments, setDepartments] = useState([])
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [driveModal, setDriveModal] = useState({ open: false, data: null })
  const [companyModal, setCompanyModal] = useState({ open: false, data: null })
  const [placementModal, setPlacementModal] = useState({ open: false, data: null, lockDrive: false })
  const [submitting, setSubmitting] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [statsRes, drivesRes, companiesRes, deptRes, placementsRes] = await Promise.all([
        getPlacementStats(),
        getDrives(),
        getCompanies(),
        getDepartments(),
        getPlacements(),
      ])
      setStats(statsRes.data)
      setDrives(drivesRes.data)
      setCompanies(companiesRes.data)
      setDepartments(deptRes.data)
      setPlacements(placementsRes.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  // Drives
  const handleDriveSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (driveModal.data) {
        await updateDrive(driveModal.data._id, payload)
      } else {
        await createDrive(payload)
      }
      setDriveModal({ open: false, data: null })
      await loadAll()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDriveDelete = async (drive) => {
    if (!window.confirm(`Delete drive "${drive.role}" at ${drive.company?.name}?`)) return
    try {
      await deleteDrive(drive._id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  // Companies
  const handleCompanySubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (companyModal.data) {
        await updateCompany(companyModal.data._id, payload)
      } else {
        await createCompany(payload)
      }
      setCompanyModal({ open: false, data: null })
      await loadAll()
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompanyDelete = async (company) => {
    if (!window.confirm(`Delete company "${company.name}"?`)) return
    try {
      await deleteCompany(company._id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  // Placements
  const handlePlacementSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (placementModal.data) {
        await updatePlacement(placementModal.data._id, payload)
      } else {
        await createPlacement(payload)
      }
      setPlacementModal({ open: false, data: null, lockDrive: false })
      await loadAll()
    } finally {
      setSubmitting(false)
    }
  }

  const handlePlacementDelete = async (placement) => {
    if (!window.confirm(`Remove placement record for "${placement.studentName}"?`)) return
    try {
      await deletePlacement(placement._id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Placement Cell</h1>
          <p className="page-subtitle">Drives, recruiters and student placements</p>
        </div>
        <div className="placement-header-actions">
          <button type="button" className="btn" onClick={() => setCompanyModal({ open: true, data: null })}>
            + Company
          </button>
          <button type="button" className="btn" onClick={() => setDriveModal({ open: true, data: null })}>
            + Drive
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setPlacementModal({ open: true, data: null, lockDrive: false })}
          >
            + Record Placement
          </button>
        </div>
      </div>

      <StatsBar stats={stats} />

      <nav className="segmented-control">
        {SUB_VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            className={`segment ${subView === view.id ? 'segment-active' : ''}`}
            onClick={() => setSubView(view.id)}
          >
            {view.label}
          </button>
        ))}
      </nav>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading placement data...</div>
      ) : (
        <>
          {subView === 'drives' && (
            <DriveBoard
              drives={drives}
              onEdit={(drive) => setDriveModal({ open: true, data: drive })}
              onDelete={handleDriveDelete}
              onAddPlacement={(drive) =>
                setPlacementModal({ open: true, data: { drive }, lockDrive: true })
              }
            />
          )}

          {subView === 'companies' && (
            <CompanyGrid
              companies={companies}
              onEdit={(company) => setCompanyModal({ open: true, data: company })}
              onDelete={handleCompanyDelete}
            />
          )}

          {subView === 'placements' && (
            <PlacementLeaderboard
              placements={placements}
              onEdit={(placement) => setPlacementModal({ open: true, data: placement, lockDrive: false })}
              onDelete={handlePlacementDelete}
            />
          )}
        </>
      )}

      {driveModal.open && (
        <Modal
          title={driveModal.data ? 'Edit Drive' : 'Schedule Drive'}
          onClose={() => setDriveModal({ open: false, data: null })}
        >
          <DriveForm
            initialValues={driveModal.data || {}}
            companies={companies}
            departments={departments}
            onSubmit={handleDriveSubmit}
            onCancel={() => setDriveModal({ open: false, data: null })}
            submitting={submitting}
          />
        </Modal>
      )}

      {companyModal.open && (
        <Modal
          title={companyModal.data ? 'Edit Company' : 'Add Company'}
          onClose={() => setCompanyModal({ open: false, data: null })}
        >
          <CompanyForm
            initialValues={companyModal.data || {}}
            onSubmit={handleCompanySubmit}
            onCancel={() => setCompanyModal({ open: false, data: null })}
            submitting={submitting}
          />
        </Modal>
      )}

      {placementModal.open && (
        <Modal
          title={placementModal.data?._id ? 'Edit Placement' : 'Record Placement'}
          onClose={() => setPlacementModal({ open: false, data: null, lockDrive: false })}
        >
          <PlacementForm
            initialValues={placementModal.data || {}}
            drives={drives}
            departments={departments}
            lockDrive={placementModal.lockDrive}
            onSubmit={handlePlacementSubmit}
            onCancel={() => setPlacementModal({ open: false, data: null, lockDrive: false })}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}

export default PlacementsPage
