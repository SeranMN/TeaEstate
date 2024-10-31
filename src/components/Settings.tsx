import React from 'react';
import { useStore } from '../store/useStore';
import { useForm } from 'react-hook-form';

interface SettingsForm {
  minimumTeaWeight: number;
  dailyRate: number;
}

export function Settings() {
  const { minimumTeaWeight, dailyRate, setMinimumTeaWeight, setDailyRate, user } =
    useStore();
  const { register, handleSubmit } = useForm<SettingsForm>({
    defaultValues: {
      minimumTeaWeight,
      dailyRate,
    },
  });

  const onSubmit = (data: SettingsForm) => {
    setMinimumTeaWeight(data.minimumTeaWeight);
    setDailyRate(data.dailyRate);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">
          Access Denied
        </h2>
        <p className="mt-2 text-gray-600">
          Only administrators can access settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Tea Weight (kg/day)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Minimum average weight required to count as one day worked
            </p>
            <input
              type="number"
              {...register('minimumTeaWeight')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Daily Rate (LKR)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Amount paid per day when minimum weight is achieved
            </p>
            <input
              type="number"
              {...register('dailyRate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              min="0"
              step="100"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}