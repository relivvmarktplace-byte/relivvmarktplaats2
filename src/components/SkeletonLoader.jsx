import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-pulse">
    <div className="h-64 bg-slate-200 dark:bg-slate-700"></div>
    <div className="p-6 space-y-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonMessage = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[70%] animate-pulse">
          <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl w-64"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
      ))}
    </div>
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-12 bg-slate-200 dark:bg-slate-700"></div>
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex space-x-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
        </div>
      ))}
    </div>
  </div>
);

export default {
  SkeletonCard,
  SkeletonList,
  SkeletonMessage,
  SkeletonDashboard,
  SkeletonTable
};
