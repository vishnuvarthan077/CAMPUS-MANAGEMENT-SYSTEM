import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const FacultySearch = ({
  filters,
  onFilterChange,
  onReset,
  departments = [],
}) => {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="toolbar" style={{ margin: 0 }}>
        {/* Search Input */}
        <div className="toolbar-search">
          <Search className="toolbar-search-icon" size={18} />
          <input
            type="text"
            name="search"
            placeholder="Search by faculty name, ID, research, or email..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="toolbar-filters">
          {/* Department Filter */}
          <select
            className="filter-select"
            value={filters.department || 'ALL'}
            onChange={(e) => onFilterChange('department', e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))
            ) : (
              <>
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Electrical Eng">Electrical Eng</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
                <option value="Civil Eng">Civil Eng</option>
              </>
            )}
          </select>

          {/* Designation Filter */}
          <select
            className="filter-select"
            value={filters.designation || 'ALL'}
            onChange={(e) => onFilterChange('designation', e.target.value)}
          >
            <option value="ALL">All Ranks / Designations</option>
            <option value="Professor & Chair">Professor & Chair</option>
            <option value="Head of Department">Head of Department</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>

          {/* Status Filter */}
          <select
            className="filter-select"
            value={filters.status || 'ALL'}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Staff</option>
            <option value="On Leave">On Sabbatical / Leave</option>
            <option value="Retired">Emeritus / Retired</option>
          </select>

          {/* Reset Button */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={onReset}
            title="Reset Filters"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultySearch;

