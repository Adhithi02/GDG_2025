import React, { createContext, useState, useContext, useEffect } from 'react';
import { Complaint, ComplaintContextType } from '../types';

const COMPLAINTS_STORAGE_KEY = 'civic-rights-complaints';

const getInitialComplaints = (): Complaint[] => {
  const storedComplaints = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
  if (storedComplaints) {
    return JSON.parse(storedComplaints);
  }
  
  // Sample complaints for demonstration
  const sampleComplaints: Complaint[] = [
    {
      id: '1',
      userId: '1',
      title: 'Water leakage in main pipeline',
      description: 'There is a major water leakage in the main pipeline near my house causing water wastage.',
      image: 'https://images.unsplash.com/photo-1584677626646-7c8f83690304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      location: '12 Main St, Bangalore',
      status: 'pending',
      department: 'BWSSB',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      id: '2',
      userId: '1',
      title: 'Frequent power cuts',
      description: 'We are experiencing frequent power cuts in our area for the past week.',
      image: 'https://images.unsplash.com/photo-1605493725784-56d8e6b33783?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      location: '45 Park Avenue, Bangalore',
      status: 'in-progress',
      department: 'BESCOM',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    },
    {
      id: '3',
      userId: '1',
      title: 'Broken street light',
      description: 'The street light near the park has been broken for weeks causing safety concerns.',
      image: 'https://images.unsplash.com/photo-1573346544140-e5e2a7a5e8f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      location: '78 Garden Road, Bangalore',
      status: 'resolved',
      department: 'BESCOM',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      resolvedImage: 'https://images.unsplash.com/photo-1617919759916-0642e3e3e1f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      resolvedAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    }
  ];
  
  localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(sampleComplaints));
  return sampleComplaints;
};

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(getInitialComplaints);

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setComplaints(prevComplaints => [...prevComplaints, newComplaint]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === id ? { ...complaint, ...updates } : complaint
      )
    );
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prevComplaints => 
      prevComplaints.filter(complaint => complaint.id !== id)
    );
  };

  const getComplaintsByDepartment = (department: string) => {
    return complaints.filter(complaint => complaint.department === department);
  };

  const getComplaintsByUser = (userId: string) => {
    return complaints.filter(complaint => complaint.userId === userId);
  };

  return (
    <ComplaintContext.Provider value={{ 
      complaints, 
      addComplaint, 
      updateComplaint, 
      deleteComplaint,
      getComplaintsByDepartment,
      getComplaintsByUser
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = (): ComplaintContextType => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};