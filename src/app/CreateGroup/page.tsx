'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import { createGroup } from '@/lib/actions/groupActions';
import { useRouter } from 'next/navigation';

export default function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [totalMembers, setTotalMembers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('name', groupName);
      formData.append('description', description);
      formData.append('monthly_contribution', monthlyContribution);
      formData.append('total_members', totalMembers);
      formData.append('duration_months', useCustomDuration ? customDuration : duration);

      const result = await createGroup(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Success - redirect to group details
        router.push(`/GroupDetail/${result.data?.id}`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="groups" />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Create New Group</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="max-w-2xl">
          <div className="mb-6">
            <label className="block mb-2">Group Name</label>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-[#2a3a2a] border border-[#3a4a3a] rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2">Description</label>
            <textarea
              placeholder="Enter group description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#2a3a2a] border border-[#3a4a3a] rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2">Duration</label>
            {!useCustomDuration ? (
              <div>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#2a3a2a] border border-[#3a4a3a] rounded-md p-3 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                </select>
                <button 
                  onClick={() => setUseCustomDuration(true)} 
                  className="text-sm text-green-400 mt-2 hover:underline"
                  type="button"
                >
                  Use custom duration
                </button>
              </div>
            ) : (
              <div>
                <div className="flex">
                  <input
                    type="number"
                    placeholder="Enter custom duration in months"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full bg-[#2a3a2a] border border-[#3a4a3a] rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                    min="1"
                    required
                  />
                  <span className="ml-2 flex items-center text-gray-400">months</span>
                </div>
                <button 
                  onClick={() => {
                    setUseCustomDuration(false);
                    setCustomDuration('');
                  }} 
                  className="text-sm text-green-400 mt-2 hover:underline"
                  type="button"
                >
                  Use preset durations
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2">Monthly Contribution</label>
            <div className="flex">
              <span className="flex items-center p-3 bg-[#2a3a2a] border border-r-0 border-[#3a4a3a] rounded-l-md text-gray-400">$</span>
              <input
                type="number"
                placeholder="Enter monthly contribution amount"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full bg-[#2a3a2a] border border-[#3a4a3a] rounded-r-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block mb-2">Total Members</label>
            <input
              type="number"
              placeholder="Enter total number of members"
              value={totalMembers}
              onChange={(e) => setTotalMembers(e.target.value)}
              className="w-full bg-[#2a3a2a] border border-[#3a4a3a] rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
              min="2"
              required
            />
            <p className="text-sm text-gray-400 mt-1">Minimum 2 members required for a chit fund group</p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !groupName || !description || (useCustomDuration ? !customDuration : !duration) || !monthlyContribution || !totalMembers}
              type="submit"
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
