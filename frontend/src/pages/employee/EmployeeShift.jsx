import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sun, Moon, Coffee, AlertCircle } from 'lucide-react';
import authenticatedFetch from '../../utils/apiHandler';
import API_URL from '../../config/api';
import '../../styles/EmployeePanel.css';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EmployeeShift = () => {
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authenticatedFetch(`${API_URL}/api/employee-dashboard/stats`);
        const json = await res.json();
        if (json.success) {
          const s = json.employee?.workSetup?.shift;
          setShift(s || null);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="dashboard-loading"><div className="loader"></div><span>Loading shift...</span></div>;

  if (!shift) {
    return (
      <div className="ep-page">
        <div className="ep-page-header"><h2>My Shift</h2><p>Your assigned shift schedule</p></div>
        <div className="ep-card ep-empty-docs">
          <AlertCircle size={48} />
          <h3>No Shift Assigned</h3>
          <p>You have not been assigned a shift yet. Please contact your HR or manager.</p>
        </div>
      </div>
    );
  }

  const schedule = shift.schedule || {};
  const weekOffDays = shift.weekOffDays || [];

  const infoItems = [
    { label: 'Shift Name', value: shift.shiftName, icon: <Clock size={16} /> },
    { label: 'Shift Code', value: shift.shiftCode || '—', icon: <Clock size={16} /> },
    { label: 'Hours Type', value: shift.hoursType || '—', icon: <Sun size={16} /> },
    { label: 'Week Off Type', value: shift.weekOffType || '—', icon: <Calendar size={16} /> },
    { label: 'Week Off Days', value: weekOffDays.length > 0 ? weekOffDays.join(', ') : '—', icon: <Moon size={16} /> },
    { label: 'Short Leave Allowed', value: shift.allowShortLeave ? 'Yes' : 'No', icon: <Coffee size={16} /> },
  ];

  return (
    <div className="ep-page">
      <div className="ep-page-header">
        <div>
          <h2>My Shift</h2>
          <p>Your assigned shift schedule and timings</p>
        </div>
        <div className="ep-shift-name-badge">
          <Clock size={16} />
          {shift.shiftName}
        </div>
      </div>

      {/* Shift Overview */}
      <div className="ep-shift-overview-grid">
        {infoItems.map((item, i) => (
          <div key={i} className="ep-shift-info-card">
            <div className="ep-shift-info-icon">{item.icon}</div>
            <div>
              <label>{item.label}</label>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Schedule */}
      <div className="ep-card ep-shift-schedule-card">
        <div className="ep-card-header">
          <Calendar size={18} />
          <h3>Weekly Schedule</h3>
        </div>
        <div className="ep-shift-schedule-table">
          <div className="ep-shift-table-header">
            <span>Day</span>
            <span>Shift Start</span>
            <span>Shift End</span>
            <span>Lunch</span>
            <span>Status</span>
          </div>
          {DAYS.map((day, i) => {
            const isWeekOff = weekOffDays.map(d => d.toLowerCase()).includes(day);
            const daySchedule = schedule[day] || {};
            return (
              <div key={day} className={`ep-shift-table-row ${isWeekOff ? 'week-off' : ''}`}>
                <span className="ep-shift-day-label">{DAY_LABELS[i]}</span>
                <span>{isWeekOff ? '—' : (daySchedule.shiftStart || '—')}</span>
                <span>{isWeekOff ? '—' : (daySchedule.shiftEnd || '—')}</span>
                <span>
                  {isWeekOff ? '—' : (
                    daySchedule.lunchStart && daySchedule.lunchEnd
                      ? `${daySchedule.lunchStart} – ${daySchedule.lunchEnd}`
                      : '—'
                  )}
                </span>
                <span>
                  {isWeekOff ? (
                    <span className="ep-shift-status-chip off">Week Off</span>
                  ) : (
                    <span className="ep-shift-status-chip working">Working</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Late / Early Out Policy */}
      <div className="ep-shift-policy-grid">
        <div className="ep-card ep-shift-policy-card">
          <div className="ep-card-header"><Clock size={16} /><h4>Late In Policy</h4></div>
          <div className="ep-policy-rows">
            <div className="ep-policy-row"><label>Max Late Minutes</label><span>{shift.maxLateInMinutes ?? '—'} min</span></div>
            <div className="ep-policy-row"><label>Require Reason</label><span>{shift.requireLateReason ? 'Yes' : 'No'}</span></div>
            <div className="ep-policy-row"><label>Apply Leave if Exceeded</label><span>{shift.applyLeaveIfLimitExceeded ? 'Yes' : 'No'}</span></div>
          </div>
        </div>
        <div className="ep-card ep-shift-policy-card">
          <div className="ep-card-header"><Clock size={16} /><h4>Early Out Policy</h4></div>
          <div className="ep-policy-rows">
            <div className="ep-policy-row"><label>Max Early Out Minutes</label><span>{shift.maxEarlyOutMinutes ?? '—'} min</span></div>
            <div className="ep-policy-row"><label>Require Reason</label><span>{shift.requireEarlyOutReason ? 'Yes' : 'No'}</span></div>
            <div className="ep-policy-row"><label>Late/Early Type</label><span>{shift.lateEarlyType || '—'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeShift;
