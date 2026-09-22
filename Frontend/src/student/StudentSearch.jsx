import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

const StudentSearch = ({ 
  filters, 
  onFilterChange, 
  onReset, 
  departments = [], 
  totalCount = 0 
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
            {departments.length > 0 ? (
              departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))
            ) : (
              <>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Eng">Electrical Eng</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
                <option value="Civil Eng">Civil Eng</option>
                <option value="Mathematics">Mathematics</option>
              </>
            )}
          </select>

          {/* Academic Year Filter */}
          <select
            className="filter-select"
            value={filters.year || 'ALL'}
            onChange={(e) => onFilterChange('year', e.target.value)}
          >
            <option value="ALL">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          {/* Status Filter */}
          <select
            className="filter-select"
            value={filters.status || 'ALL'}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Graduated">Graduated</option>
            <option value="On Leave">On Leave</option>
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

