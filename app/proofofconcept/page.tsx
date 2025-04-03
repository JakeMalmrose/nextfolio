"use client"

import React, { useState } from 'react';
import { X, Eye, EyeOff, ChevronLeft, ChevronRight, Search, Trash2, Plus, User, Shield } from 'lucide-react';

// Main Application Component
const WorkfrontPortal = () => {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState('user');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [instanceToDelete, setInstanceToDelete] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Sample data
  const userInstances = [
    { id: 1, name: 'Marketing Team', subdomain: 'mkt-team', userId: 'user123', clusterId: 'c-8723', imsId: 'ims-9001' },
    { id: 2, name: 'Sales Department', subdomain: 'sales-dept', userId: 'user456', clusterId: 'c-8724', imsId: 'ims-9002' }
  ];

  const adminInstances = [
    { id: 1, name: 'Marketing Team', subdomain: 'mkt-team', userId: 'user123', clusterId: 'c-8723', imsId: 'ims-9001' },
    { id: 2, name: 'Sales Department', subdomain: 'sales-dept', userId: 'user456', clusterId: 'c-8724', imsId: 'ims-9002' },
    { id: 3, name: 'Product Development', subdomain: 'product-dev', userId: 'user789', clusterId: 'c-8725', imsId: 'ims-9003' },
    { id: 4, name: 'Customer Support', subdomain: 'cust-support', userId: 'user234', clusterId: 'c-8726', imsId: 'ims-9004' },
    { id: 5, name: 'Human Resources', subdomain: 'hr-team', userId: 'user567', clusterId: 'c-8727', imsId: 'ims-9005' },
    { id: 6, name: 'Finance Department', subdomain: 'finance', userId: 'user890', clusterId: 'c-8728', imsId: 'ims-9006' },
    { id: 7, name: 'Executive Office', subdomain: 'exec-office', userId: 'user321', clusterId: 'c-8729', imsId: 'ims-9007' }
  ];

  const handleLogin = () => {
    setPage('portal');
  };

  const handleDelete = (instance: any) => {
    setInstanceToDelete(instance);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real application, this would delete the instance
    setShowDeleteModal(false);
    setInstanceToDelete(null);
  };

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  // Start and end index for pagination
  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const currentInstances = adminInstances.slice(startIndex, endIndex);
  const totalPages = Math.ceil(adminInstances.length / 5);

  // Adobe brand style overrides
  const adobeStyles = {
    page: {
      backgroundColor: '#f5f5f5',
      color: '#2c2c2c',
      fontFamily: 'Adobe Clean, sans-serif'
    },
    header: {
      backgroundColor: '#2c2c2c',
      color: '#ffffff'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    primaryButton: {
      backgroundColor: '#fa0f00',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      fontWeight: 500
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#505050',
      border: '1px solid #d3d3d3',
      borderRadius: '4px',
      padding: '8px 16px'
    },
    destructiveButton: {
      backgroundColor: '#fa0f00',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px'
    },
    input: {
      backgroundColor: '#ffffff',
      border: '1px solid #d3d3d3',
      borderRadius: '4px',
      padding: '8px 12px',
      color: '#2c2c2c'
    },
    tableHeader: {
      backgroundColor: '#f5f5f5',
      color: '#6e6e6e'
    },
    modalOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    table: {
      borderColor: '#e1e1e1'
    },
    link: {
      color: '#1473e6'
    },
    segmentedControl: {
      backgroundColor: '#e1e1e1',
      selectedColor: '#fa0f00',
      textColor: '#2c2c2c',
      selectedTextColor: '#ffffff'
    }
  };

  // Render login page
  if (page === 'login') {
    return (
      <div style={adobeStyles.page} className="min-h-screen flex items-center justify-center">
        <div style={adobeStyles.card} className="p-8 w-96">
          <div className="text-center mb-6">
            <svg width="48" height="48" viewBox="0 0 240 234" className="mx-auto mb-2">
              <path d="M42.3,122l-3,7.2h-.1V122h-3.8v12.7h3.8l3.3-7.7h.1v7.7h3.8V122H42.3z" fill="#fa0f00"/>
              <path d="M54.7,126.8h-2.7v-3.1h2.7v-2.3h-2.7v-3h-3.8v12.3h7.2v-2.3h-3.4V126.8z" fill="#fa0f00"/>
              <rect width="240" height="234" fill="none"/>
            </svg>
            <h2 style={{color: '#2c2c2c'}} className="text-2xl font-bold">Workfront Portal</h2>
            <p style={{color: '#6e6e6e'}} className="mt-1">Sign in with your Okta account</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                style={adobeStyles.input}
                className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="your.email@company.com"
              />
            </div>
            
            <div>
              <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input 
                  type={passwordVisible ? "text" : "password"} 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your password"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  className="h-4 w-4 text-red-600 focus:ring-red-500 rounded"
                />
                <label htmlFor="remember-me" style={{color: '#6e6e6e'}} className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
              <a href="#" style={adobeStyles.link} className="text-sm hover:underline">Forgot password?</a>
            </div>
            
            <button
              type="button"
              onClick={handleLogin}
              style={adobeStyles.primaryButton}
              className="w-full hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Sign in with Okta
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm" style={{color: '#6e6e6e'}}>
            Need help? Contact <a href="#" style={adobeStyles.link} className="hover:underline">IT Support</a>
          </div>
        </div>
      </div>
    );
  }

  // Portal page (User or Admin)
  return (
    <div style={adobeStyles.page} className="min-h-screen">
      {/* Header */}
      <header style={adobeStyles.header} className="mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg width="30" height="30" viewBox="0 0 240 234" className="mr-2">
              <path d="M42.3,122l-3,7.2h-.1V122h-3.8v12.7h3.8l3.3-7.7h.1v7.7h3.8V122H42.3z" fill="#fa0f00"/>
              <path d="M54.7,126.8h-2.7v-3.1h2.7v-2.3h-2.7v-3h-3.8v12.3h7.2v-2.3h-3.4V126.8z" fill="#fa0f00"/>
              <rect width="240" height="234" fill="none"/>
            </svg>
            <h1 className="text-xl font-semibold">Workfront Instance Manager</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div style={{backgroundColor: adobeStyles.segmentedControl.backgroundColor}} className="rounded-full p-1 flex">
              <button 
                style={{
                  backgroundColor: role === 'user' ? adobeStyles.segmentedControl.selectedColor : 'transparent',
                  color: role === 'user' ? adobeStyles.segmentedControl.selectedTextColor : adobeStyles.segmentedControl.textColor
                }}
                className="px-3 py-1 rounded-full text-sm flex items-center"
                onClick={() => setRole('user')}
              >
                <User size={16} className="mr-1" /> User
              </button>
              <button 
                style={{
                  backgroundColor: role === 'admin' ? adobeStyles.segmentedControl.selectedColor : 'transparent',
                  color: role === 'admin' ? adobeStyles.segmentedControl.selectedTextColor : adobeStyles.segmentedControl.textColor
                }}
                className="px-3 py-1 rounded-full text-sm flex items-center"
                onClick={() => setRole('admin')}
              >
                <Shield size={16} className="mr-1" /> Admin
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                JD
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div style={adobeStyles.card} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 style={{color: '#2c2c2c'}} className="text-lg font-medium">
              {role === 'user' ? 'My Workfront Instances' : 'All Workfront Instances'}
            </h2>
            <button 
              onClick={toggleCreateModal}
              style={adobeStyles.primaryButton}
              className="flex items-center hover:bg-red-800"
            >
              <Plus size={16} className="mr-1" /> Create Instance
            </button>
          </div>
          
          {/* Admin Filters */}
          {role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">Cluster ID</label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Filter by Cluster ID"
                />
              </div>
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">IMS ID</label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Filter by IMS ID"
                />
              </div>
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">User ID</label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Filter by User ID"
                />
              </div>
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <input 
                    type="text" 
                    style={adobeStyles.input}
                    className="w-full pl-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Search by name"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          {/* Instances Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full" style={{borderCollapse: 'separate', borderSpacing: '0'}}>
              <thead style={adobeStyles.tableHeader}>
                <tr>
                  <th style={{textAlign: 'left', padding: '12px 16px', fontWeight: 500}} className="text-xs uppercase tracking-wider rounded-tl-md">Name</th>
                  <th style={{textAlign: 'left', padding: '12px 16px', fontWeight: 500}} className="text-xs uppercase tracking-wider">Subdomain</th>
                  <th style={{textAlign: 'left', padding: '12px 16px', fontWeight: 500}} className="text-xs uppercase tracking-wider">User ID</th>
                  {role === 'admin' && (
                    <>
                      <th style={{textAlign: 'left', padding: '12px 16px', fontWeight: 500}} className="text-xs uppercase tracking-wider">Cluster ID</th>
                      <th style={{textAlign: 'left', padding: '12px 16px', fontWeight: 500}} className="text-xs uppercase tracking-wider">IMS ID</th>
                    </>
                  )}
                  <th style={{textAlign: 'right', padding: '12px 16px', fontWeight: 500}} className="text-xs uppercase tracking-wider rounded-tr-md">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(role === 'user' ? userInstances : currentInstances).map((instance, index) => (
                  <tr 
                    key={instance.id} 
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                      borderBottom: '1px solid #e1e1e1'
                    }}
                    className="hover:bg-gray-100"
                  >
                    <td style={{padding: '12px 16px'}} className="whitespace-nowrap">
                      <div style={{color: '#2c2c2c'}} className="text-sm font-medium">{instance.name}</div>
                    </td>
                    <td style={{padding: '12px 16px'}} className="whitespace-nowrap">
                      <div style={{color: '#6e6e6e'}} className="text-sm">{instance.subdomain}</div>
                    </td>
                    <td style={{padding: '12px 16px'}} className="whitespace-nowrap">
                      <div style={{color: '#6e6e6e'}} className="text-sm">{instance.userId}</div>
                    </td>
                    {role === 'admin' && (
                      <>
                        <td style={{padding: '12px 16px'}} className="whitespace-nowrap">
                          <div style={{color: '#6e6e6e'}} className="text-sm">{instance.clusterId}</div>
                        </td>
                        <td style={{padding: '12px 16px'}} className="whitespace-nowrap">
                          <div style={{color: '#6e6e6e'}} className="text-sm">{instance.imsId}</div>
                        </td>
                      </>
                    )}
                    <td style={{padding: '12px 16px'}} className="whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(instance)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Admin only) */}
          {role === 'admin' && (
            <div className="flex items-center justify-between mt-6">
              <div style={{color: '#6e6e6e'}} className="text-sm">
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, adminInstances.length)}</span> of{' '}
                <span className="font-medium">{adminInstances.length}</span> instances
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    ...adobeStyles.secondaryButton,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      ...(currentPage === i + 1 ? 
                        {...adobeStyles.primaryButton, padding: '8px 12px'} : 
                        {...adobeStyles.secondaryButton, padding: '8px 12px'})
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    ...adobeStyles.secondaryButton,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={adobeStyles.modalOverlay} className="fixed inset-0 flex items-center justify-center z-50">
          <div style={adobeStyles.card} className="p-6 max-w-md w-full">
            <div className="flex justify-between items-start">
              <h3 style={{color: '#2c2c2c'}} className="text-lg font-medium">Confirm Deletion</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4">
              <p style={{color: '#6e6e6e'}}>
                Are you sure you want to delete the instance? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                style={adobeStyles.secondaryButton}
                className="hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={adobeStyles.destructiveButton}
                className="hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Instance Modal */}
      {showCreateModal && (
        <div style={adobeStyles.modalOverlay} className="fixed inset-0 flex items-center justify-center z-50">
          <div style={adobeStyles.card} className="p-6 max-w-md w-full">
            <div className="flex justify-between items-start">
              <h3 style={{color: '#2c2c2c'}} className="text-lg font-medium">Create New Instance</h3>
              <button onClick={toggleCreateModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">Name <span className="text-red-600">*</span></label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Instance name"
                />
              </div>
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">Subdomain <span className="text-red-600">*</span></label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Instance subdomain"
                />
              </div>
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">User ID <span className="text-red-600">*</span></label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="User ID"
                />
              </div>
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">Cluster ID (Optional)</label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Cluster ID"
                />
              </div>
              <div>
                <label style={{color: '#6e6e6e'}} className="block text-sm font-medium mb-1">IMS ID (Optional)</label>
                <input 
                  type="text" 
                  style={adobeStyles.input}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="IMS ID"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={toggleCreateModal}
                style={adobeStyles.secondaryButton}
                className="hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={toggleCreateModal}
                style={adobeStyles.primaryButton}
                className="hover:bg-red-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkfrontPortal;