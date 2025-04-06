import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle, Filter, Building2, ChevronRight, Eye } from 'lucide-react';
import { Complaint, DEPARTMENTS } from '../../types';

const CircularProgress: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="48"
          cy="48"
        />
        <circle
          className={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="48"
          cy="48"
        />
      </svg>
      <span className="absolute text-xl font-semibold">{value}</span>
    </div>
  );
};

const GovernmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  // Get complaints based on selection or show all if no department is selected
  const filteredComplaints = selectedDepartment 
    ? complaints.filter(c => c.department === selectedDepartment)
    : complaints;

  const displayedComplaints = statusFilter === 'all' 
    ? filteredComplaints 
    : filteredComplaints.filter(c => c.status === statusFilter);
  
  // Calculate stats for the selected view
  const totalComplaints = filteredComplaints.length;
  const pendingCount = filteredComplaints.filter(c => c.status === 'pending').length;
  const inProgressCount = filteredComplaints.filter(c => c.status === 'in-progress').length;
  const resolvedCount = filteredComplaints.filter(c => c.status === 'resolved').length;

  // Calculate stats for each department
  const departmentStats = DEPARTMENTS.map(dept => ({
    ...dept,
    count: complaints.filter(c => c.department === dept.id).length,
    pending: complaints.filter(c => c.department === dept.id && c.status === 'pending').length,
    inProgress: complaints.filter(c => c.department === dept.id && c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.department === dept.id && c.status === 'resolved').length,
  }));

  // Check if the user can edit the currently viewed complaints
  const canEditComplaints = user?.department === selectedDepartment || (!selectedDepartment && user?.department);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Departments</h2>
          </div>
          <nav className="mt-4">
            {/* All Departments Option */}
            <button
              onClick={() => setSelectedDepartment(null)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                !selectedDepartment ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center">
                <Building2 size={18} className="mr-2" />
                All Departments
              </span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {complaints.length}
              </span>
            </button>

            {/* Individual Departments */}
            {departmentStats.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                  selectedDepartment === dept.id 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <ChevronRight size={18} className="mr-2" />
                  {dept.name}
                  {user?.department === dept.id && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      My Dept
                    </span>
                  )}
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {dept.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                {selectedDepartment ? 
                  `${DEPARTMENTS.find(d => d.id === selectedDepartment)?.name} Dashboard` :
                  'All Departments Dashboard'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {canEditComplaints ? 
                  'Manage and resolve complaints for your department' :
                  'View complaints across all departments'}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <div className="grid grid-cols-4 gap-8">
                <div className="text-center">
                  <CircularProgress 
                    value={totalComplaints} 
                    max={complaints.length} 
                    color="text-gray-500" 
                  />
                  <p className="mt-2 font-medium text-gray-700">Total</p>
                </div>
                <div className="text-center">
                  <CircularProgress 
                    value={pendingCount} 
                    max={totalComplaints} 
                    color="text-yellow-500" 
                  />
                  <p className="mt-2 font-medium text-yellow-700">Pending</p>
                </div>
                <div className="text-center">
                  <CircularProgress 
                    value={inProgressCount} 
                    max={totalComplaints} 
                    color="text-blue-500" 
                  />
                  <p className="mt-2 font-medium text-blue-700">In Progress</p>
                </div>
                <div className="text-center">
                  <CircularProgress 
                    value={resolvedCount} 
                    max={totalComplaints} 
                    color="text-green-500" 
                  />
                  <p className="mt-2 font-medium text-green-700">Resolved</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Filter size={16} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 mr-4">Filter by Status:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-gray-200 text-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setStatusFilter('in-progress')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setStatusFilter('resolved')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {statusFilter === 'all' ? 'All Complaints' : 
                    statusFilter === 'pending' ? 'Pending Complaints' : 
                    statusFilter === 'in-progress' ? 'In Progress Complaints' : 
                    'Resolved Complaints'}
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {displayedComplaints.length === 0 ? (
                  <li className="px-4 py-8">
                    <div className="text-center">
                      <p className="text-gray-500">No complaints found with the selected filter.</p>
                    </div>
                  </li>
                ) : (
                  displayedComplaints.map((complaint) => {
                    const isEditable = user?.department === complaint.department;
                    
                    return (
                      <li key={complaint.id} className="px-4 py-4 hover:bg-gray-50">
                        {isEditable ? (
                          <Link to={`/government/complaint/${complaint.id}`} className="block">
                            <ComplaintItem complaint={complaint} isEditable={true} />
                          </Link>
                        ) : (
                          <div className="block">
                            <ComplaintItem complaint={complaint} isEditable={false} />
                          </div>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Complaint Item Component
const ComplaintItem: React.FC<{ 
  complaint: Complaint; 
  isEditable: boolean;
}> = ({ complaint, isEditable }) => {
  const getStatusBadge = () => {
    switch (complaint.status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Resolved
          </span>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <p className={`text-sm font-medium ${isEditable ? 'text-blue-600' : 'text-gray-900'}`}>
            {complaint.title}
          </p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {DEPARTMENTS.find(d => d.id === complaint.department)?.name}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge()}
          {!isEditable && (
            <span className="inline-flex items-center text-xs text-gray-500">
              <Eye size={12} className="mr-1" />
              View Only
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <p className="flex items-center text-sm text-gray-500">
            {complaint.location}
          </p>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <p>
            Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;