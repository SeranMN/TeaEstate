import React from 'react';
import { Users, Leaf, Home, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Dashboard() {
  const { employees, teaRecords } = useStore();

  const stats = [
    {
      name: 'Total Employees',
      value: employees.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Resident Employees',
      value: employees.filter(e => e.isResident).length,
      icon: Home,
      color: 'bg-green-500',
    },
    {
      name: "Today's Records",
      value: teaRecords.filter(r => 
        new Date(r.date).toDateString() === new Date().toDateString()
      ).length,
      icon: Leaf,
      color: 'bg-yellow-500',
    },
    {
      name: 'Pending Approvals',
      value: 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between"
          >
            <div>
              <p className="text-sm text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Tea Records</h3>
          {/* Tea records table implementation */}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Distribution</h3>
          {/* Employee distribution chart implementation */}
        </div>
      </div>
    </div>
  );
}