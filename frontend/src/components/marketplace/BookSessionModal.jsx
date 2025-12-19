import React, { useState } from 'react';
import { X, Calendar, Clock, FileText } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { bookAdvisorySession } from '../../features/marketplace/marketplaceSlice';

const BookSessionModal = ({ isOpen, onClose, service }) => {
  const dispatch = useDispatch();
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(bookAdvisorySession({
      serviceId: service._id,
      scheduledAt: new Date(scheduledAt).toISOString(), // ISO Format for Backend
      notes
    }));

    setLoading(false);
    if (!result.error) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Book Session</h2>
            <p className="text-sm text-blue-600 dark:text-blue-400">{service.title}</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Rate: <strong>${service.price}</strong>/hr</span>
            <span className="text-gray-600 dark:text-gray-300">Duration: <strong>{service.duration} mins</strong></span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select Date & Time</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="datetime-local" 
                required 
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message / Requirements</label>
            <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea 
                rows="3"
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                placeholder="What do you want to discuss?"
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookSessionModal;