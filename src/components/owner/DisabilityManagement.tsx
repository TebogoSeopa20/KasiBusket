import React from 'react';
import { User } from '../../types';
import { disabilitySupport } from '../../services/DisabilitySupport';

interface DisabilityManagementProps {
  users: User[];
}

export function DisabilityManagement({ users }: DisabilityManagementProps) {
  const disabledUsers = users.filter(u => u.hasDisability);
  const allProfiles = disabilitySupport.getAllProfiles();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl mb-6">♿ Disability Support Management</h2>

        {/* Guidelines */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200 mb-6">
          <h3 className="text-xl mb-4">📋 Disability Support Protocols</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <div className="mb-2">🕐 <strong>Extra Time</strong></div>
              <p className="text-xs">Allow additional time for order preparation and delivery</p>
            </div>
            <div>
              <div className="mb-2">📞 <strong>Pre-Delivery Call</strong></div>
              <p className="text-xs">Call customer before delivery to confirm readiness</p>
            </div>
            <div>
              <div className="mb-2">🚶 <strong>Door Service</strong></div>
              <p className="text-xs">Provide complete door-to-door delivery service</p>
            </div>
            <div>
              <div className="mb-2">💬 <strong>Clear Communication</strong></div>
              <p className="text-xs">Use clear language and be patient</p>
            </div>
            <div>
              <div className="mb-2">🛍️ <strong>Carrying Assistance</strong></div>
              <p className="text-xs">Assist with carrying items if needed</p>
            </div>
            <div>
              <div className="mb-2">📋 <strong>Label Reading</strong></div>
              <p className="text-xs">Read labels and provide product information</p>
            </div>
            <div>
              <div className="mb-2">💵 <strong>Cash Handling</strong></div>
              <p className="text-xs">Assist with cash transactions if required</p>
            </div>
            <div>
              <div className="mb-2">⭐ <strong>Dignity & Respect</strong></div>
              <p className="text-xs">Always maintain customer dignity and respect</p>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Disability Type</th>
                <th className="px-4 py-3 text-left">Special Requirements</th>
                <th className="px-4 py-3 text-left">Registration Date</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allProfiles.map((profile, index) => {
                const user = users.find(u => u.username === profile.username);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {user?.fullName || profile.username}
                      <div className="text-xs text-gray-500">{user?.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {profile.disabilityType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-xs">
                      {profile.specialRequirements || 'None specified'}
                    </td>
                    <td className="px-4 py-3">
                      {profile.registrationDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        ✓ Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {allProfiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No disability support registrations yet.
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Total Registered</div>
          <div className="text-3xl mt-1">{allProfiles.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Visual Impairment</div>
          <div className="text-3xl mt-1">
            {allProfiles.filter(p => p.disabilityType === 'Visual Impairment').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Mobility Impairment</div>
          <div className="text-3xl mt-1">
            {allProfiles.filter(p => p.disabilityType === 'Mobility Impairment').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Other Types</div>
          <div className="text-3xl mt-1">
            {allProfiles.filter(p => !['Visual Impairment', 'Mobility Impairment'].includes(p.disabilityType)).length}
          </div>
        </div>
      </div>
    </div>
  );
}




