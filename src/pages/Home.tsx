import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Civic Rights Portal
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl">
              Report civic issues directly to government departments and track their resolution.
            </p>
            
            {!isAuthenticated && (
              <div className="mt-8 flex justify-center space-x-4">
                <Link to="/login?role=citizen" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 md:text-lg">
                  Citizen Login
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link to="/login?role=government" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-100 md:text-lg">
                  Government Login
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="mt-8 flex justify-center">
                <Link 
                  to={user?.role === 'citizen' ? '/citizen/dashboard' : '/government/dashboard'} 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 md:text-lg"
                >
                  Go to Dashboard
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                      1
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Report an Issue</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Take a photo of the civic issue, provide a description, and submit your complaint.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                      2
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Government Review</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      The appropriate government department reviews your complaint and takes action.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                      3
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Resolution</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Once resolved, officials upload proof of resolution and mark the issue as completed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home