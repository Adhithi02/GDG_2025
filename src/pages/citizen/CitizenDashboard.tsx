import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle, AlertTriangle, MapPin, Image } from 'lucide-react';

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getComplaintsByUser } = useComplaints();
  
  const userComplaints = user ? getComplaintsByUser(user.id) : [];
  const pendingComplaints = userComplaints.filter(c => c.status === 'pending');
  const inProgressComplaints = userComplaints.filter(c => c.status === 'in-progress');
  const resolvedComplaints = userComplaints.filter(c => c.status === 'resolved');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Complaints Dashboard</h1>
            <Link
              to="/citizen/new-complaint"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle size={16} className="mr-2" />
              New Complaint
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
            {[
              { label: 'Pending', count: pendingComplaints.length, icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />, bg: 'bg-yellow-100' },
              { label: 'In Progress', count: inProgressComplaints.length, icon: <Clock className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-100' },
              { label: 'Resolved', count: resolvedComplaints.length, icon: <CheckCircle className="h-6 w-6 text-green-600" />, bg: 'bg-green-100' }
            ].map(({ label, count, icon, bg }) => (
              <div key={label} className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${bg}`}>
                    {icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
                    <dd className="text-lg font-medium text-gray-900">{count}</dd>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Complaint List */}
          <div className="bg-white shadow sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">My Complaints</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {userComplaints.length === 0 ? (
                <li className="px-4 py-8 text-center text-gray-500">
                  You haven't submitted any complaints yet.
                  <div className="mt-4">
                    <Link
                      to="/citizen/new-complaint"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Submit your first complaint
                    </Link>
                  </div>
                </li>
              ) : (
                userComplaints.map(complaint => (
                  <li key={complaint.id} className="px-4 py-6 sm:px-6 hover:bg-gray-50 transition">
                    <Link to={`/citizen/complaint/${complaint.id}`} className="block">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-blue-600 truncate">{complaint.title}</p>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {complaint.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{complaint.location}</span>
                        </div>

                        <div className="flex items-center">
                          <Image className="h-4 w-4 mr-1" />
                          <span>Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>

                        {complaint.image && (
                          <div className="mt-2">
                            <img src={complaint.image} alt="Complaint" className="w-full max-w-sm rounded shadow" />
                          </div>
                        )}

                        {complaint.status === 'resolved' && complaint.resolvedImage && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-green-600">Resolved Image:</p>
                            <img src={complaint.resolvedImage} alt="Resolved" className="w-full max-w-sm rounded shadow mt-1" />
                            {complaint.resolvedAt && (
                              <p className="text-xs text-gray-500 mt-1">Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
