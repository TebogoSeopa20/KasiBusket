import React from 'react';
import { User } from '../../types';
import { creditManager } from '../../services/CreditManager';

interface CreditManagementProps {
  users: User[];
}

export function CreditManagement({ users }: CreditManagementProps) {
  const allCredits = creditManager.getAllCredits();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl mb-6">💳 Customer Credit Management</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Credit Score</th>
                <th className="px-4 py-3 text-right">Current Loan</th>
                <th className="px-4 py-3 text-center">Loan Items</th>
                <th className="px-4 py-3 text-right">Credit Limit</th>
                <th className="px-4 py-3 text-right">Available</th>
                <th className="px-4 py-3 text-left">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allCredits.map((credit, index) => {
                const user = users.find(u => u.username === credit.username);
                const available = credit.creditLimit - credit.currentLoanAmount;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {user?.fullName || credit.username}
                      <div className="text-xs text-gray-500">({credit.username})</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        credit.creditScore.includes('Excellent') 
                          ? 'bg-green-100 text-green-800'
                          : credit.creditScore.includes('Good')
                          ? 'bg-blue-100 text-blue-800'
                          : credit.creditScore.includes('Fair')
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {credit.creditScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      R {credit.currentLoanAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {credit.currentLoanItems}/5
                    </td>
                    <td className="px-4 py-3 text-right">
                      R {credit.creditLimit.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      R {available.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {credit.nextPaymentDueDate 
                        ? credit.nextPaymentDueDate.toLocaleDateString()
                        : 'No pending payments'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Total Customers</div>
          <div className="text-3xl mt-1">{allCredits.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Active Loans</div>
          <div className="text-3xl mt-1">
            {allCredits.filter(c => c.currentLoanAmount > 0).length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Total Outstanding</div>
          <div className="text-3xl mt-1">
            R {allCredits.reduce((sum, c) => sum + c.currentLoanAmount, 0).toFixed(0)}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm opacity-90">Overdue Payments</div>
          <div className="text-3xl mt-1">
            {allCredits.filter(c => c.nextPaymentDueDate && new Date() > c.nextPaymentDueDate).length}
          </div>
        </div>
      </div>
    </div>
  );
}




