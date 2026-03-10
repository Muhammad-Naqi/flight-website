'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    travelers: '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Search functionality coming soon! This will search for flights based on your criteria.');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">From</label>
            <input
              type="text"
              placeholder="City or airport"
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-[#455a30] focus:ring-0 text-[#272220] placeholder-gray-300 font-light text-lg transition-colors outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">To</label>
            <input
              type="text"
              placeholder="Destinations"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-[#455a30] focus:ring-0 text-[#272220] placeholder-gray-300 font-light text-lg transition-colors outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Departure</label>
            <input
              type="date"
              value={formData.departure}
              onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-[#455a30] focus:ring-0 text-[#272220] font-light text-lg transition-colors outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Return</label>
            <input
              type="date"
              value={formData.return}
              onChange={(e) => setFormData({ ...formData, return: e.target.value })}
              min={formData.departure || new Date().toISOString().split('T')[0]}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-[#455a30] focus:ring-0 text-[#272220] font-light text-lg transition-colors outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Guests</label>
            <select
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-[#455a30] focus:ring-0 text-[#272220] font-light text-lg transition-colors outline-none"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
              <option value="5">5+ Adults</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto px-10 py-3 sm:py-4 bg-[#272220] text-white font-medium tracking-wide uppercase text-sm rounded-md hover:bg-black transition-colors"
        >
          Check Availability
        </button>
      </div>
    </form>
  );
}
