import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const StudentSearch = ({
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
            placeholder="Search by student name, ID, or email..."
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
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            className="filter-select"
            value={filters.semester || 'ALL'}
            onChange={(e) => onFilterChange('semester', e.target.value)}
          >
            <option value="ALL">All Semesters</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
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

export default StudentSearch;

