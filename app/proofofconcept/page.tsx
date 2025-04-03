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

  const handleDelete = (instance) => {
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

  // Render login page
  if (page === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="paper w-96">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">Workfront Portal</h2>
            <p className="mt-1">Sign in with your Okta account</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 bg-background-paper border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your.email@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input 
                  type={passwordVisible ? "text" : "password"} 
                  className="w-full px-3 py-2 bg-background-paper border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="h-4 w-4 bg-background-paper border-primary rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-secondary">Forgot password?</a>
            </div>
            
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-primary text-background py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Sign in with Okta
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Need help? Contact <a href="#" className="text-primary hover:text-secondary">IT Support</a>
          </div>
        </div>
      </div>
    );
  }

  // Portal page (User or Admin)
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="paper mb-6 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold gradient-text">Workfront Instance Manager</h1>
          
          <div className="flex items-center space-x-4">
            <div className="bg-background rounded-full p-1 flex">
              <button 
                className={`px-3 py-1 rounded-full text-sm flex items-center ${role === 'user' ? 'bg-primary text-background' : ''}`}
                onClick={() => setRole('user')}
              >
                <User size={16} className="mr-1" /> User
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm flex items-center ${role === 'admin' ? 'bg-primary text-background' : ''}`}
                onClick={() => setRole('admin')}
              >
                <Shield size={16} className="mr-1" /> Admin
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background">
                JD
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="paper">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium gradient-text">
              {role === 'user' ? 'My Workfront Instances' : 'All Workfront Instances'}
            </h2>
            <button 
              onClick={toggleCreateModal}
              className="bg-primary text-background py-2 px-4 rounded-md flex items-center hover:opacity-90"
            >
              <Plus size={16} className="mr-1" /> Create Instance
            </button>
          </div>
          
          {/* Admin Filters */}
          {role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Cluster ID</label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Filter by Cluster ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IMS ID</label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Filter by IMS ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">User ID</label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Filter by User ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full border border-primary bg-background-paper rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Search by name"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          {/* Instances Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary divide-opacity-30">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Subdomain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">User ID</th>
                  {role === 'admin' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Cluster ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">IMS ID</th>
                    </>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary divide-opacity-20">
                {(role === 'user' ? userInstances : currentInstances).map((instance) => (
                  <tr key={instance.id} className="hover:bg-background-paper">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{instance.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm opacity-80">{instance.subdomain}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm opacity-80">{instance.userId}</div>
                    </td>
                    {role === 'admin' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm opacity-80">{instance.clusterId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm opacity-80">{instance.imsId}</div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(instance)}
                        className="text-secondary hover:opacity-80 focus:outline-none focus:underline"
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
              <div className="text-sm opacity-80">
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, adminInstances.length)}</span> of{' '}
                <span className="font-medium">{adminInstances.length}</span> instances
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-background-paper opacity-50 cursor-not-allowed' : 'bg-background-paper border border-primary hover:bg-background'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-primary text-background' : 'bg-background-paper border border-primary hover:bg-background'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-background-paper opacity-50 cursor-not-allowed' : 'bg-background-paper border border-primary hover:bg-background'}`}
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="paper max-w-md w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium gradient-text">Confirm Deletion</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4">
              <p className="opacity-80">
                Are you sure you want to delete the instance "{instanceToDelete?.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-primary rounded-md bg-background-paper hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-secondary text-foreground rounded-md hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Instance Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="paper max-w-md w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium gradient-text">Create New Instance</h3>
              <button onClick={toggleCreateModal} className="text-gray-400 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name <span className="text-secondary">*</span></label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Instance name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subdomain <span className="text-secondary">*</span></label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Instance subdomain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">User ID <span className="text-secondary">*</span></label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="User ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cluster ID (Optional)</label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Cluster ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IMS ID (Optional)</label>
                <input 
                  type="text" 
                  className="w-full border border-primary bg-background-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="IMS ID"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={toggleCreateModal}
                className="px-4 py-2 border border-primary rounded-md bg-background-paper hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={toggleCreateModal}
                className="px-4 py-2 bg-primary text-background rounded-md hover:opacity-90"
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