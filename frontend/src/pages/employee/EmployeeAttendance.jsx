import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/EmployeePanel.css';

// Generates mock attendance data for a given month/year
const generateMockAttendance = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const records = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date > today) continue;
    const day = date.getDay();
    if (day === 0 || day === 6) {
      records[d] = { status: 'weekend' };
      continue;
    }
    const rand = Math.random();
    if (rand < 0.85) {
      const inH = 9 + Math.floor(Math.random() * 2);
      const inM = Math.floor(Math.random() * 30);
      const outH = 17 + Math.floor(Math.random() * 2);
      const outM = Math.floor(Math.random() * 60);
      records[d] = {
        status: inH > 9 || inM > 15 ? 'late' : 'present',
        punchIn: `${String(inH).padStart(2, '0')}:${String(inM).padStart(2, '0')}`,
        punchOut: `${String(outH).padStart(2, '0')}:${String(outM).padStart(2, '0')}`,
        hours: `${outH - inH}h ${outM}m`,
      };
    } else if (rand < 0.92) {
      records[d] = { status: 'absent' };
    } else {
      records[d] = { status: 'leave', leaveType: 'Casual Leave' };
    }
  }
  return records;
};

const statusConfig = {
  present: { label: 'Present', color: '#10B981', bg: '#ECFDF5', icon: <CheckCircle size={14} /> },
  late: { label: 'Late', color: '#F59E0B', bg: '#FFFBEB', icon: <AlertCircle size={14} /> },
  absent: { label: 'Absent', color: '#EF4444', bg: '#FEF2F2', icon: <XCircle size={14} /> },
  leave: { label: 'Leave', color: '#8B5CF6', bg: '#F5F3FF', icon: <Calendar size={14} /> },
  weekend: { label: 'Weekend', color: '#94A3B8', bg: '#F8FAFC', icon: null },
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const EmployeeAttendance = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const attendance = generateMockAttendance(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const counts = Object.values(attendance).reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const selected = selectedDay ? attendance[selectedDay] : null;

  return (
    <div className="ep-page">
      <div className="ep-page-header">
        <h2>My Attendance</h2>
        <p>Track your daily attendance records</p>
      </div>

      {/* Summary Cards */}
      <div className="ep-att-summary">
        {[
          { label: 'Present', count: (counts.present || 0) + (counts.late || 0), color: '#10B981', bg: '#ECFDF5' },
          { label: 'Absent', count: counts.absent || 0, color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Late', count: counts.late || 0, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'On Leave', count: counts.leave || 0, color: '#8B5CF6', bg: '#F5F3FF' },
        ].map((s, i) => (
          <div key={i} className="ep-att-summary-card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <span className="ep-att-summary-count" style={{ color: s.color }}>{s.count}</span>
            <span className="ep-att-summary-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="ep-att-layout">
        {/* Calendar */}
        <div className="ep-card ep-att-calendar-card">
          <div className="ep-att-cal-header">
            <button className="ep-icon-btn" onClick={prevMonth}><ChevronLeft size={18} /></button>
            <span className="ep-att-month-label">{MONTHS[month]} {year}</span>
            <button className="ep-icon-btn" onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>

          <div className="ep-att-cal-grid">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="ep-att-cal-day-label">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const rec = attendance[day];
              const cfg = rec ? statusConfig[rec.status] : null;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSel = selectedDay === day;
              return (
                <div
                  key={day}
                  className={`ep-att-cal-day ${cfg ? rec.status : 'future'} ${isToday ? 'today' : ''} ${isSel ? 'selected' : ''}`}
                  style={cfg ? { background: isSel ? cfg.color : cfg.bg, color: isSel ? '#fff' : cfg.color } : {}}
                  onClick={() => rec && rec.status !== 'weekend' && setSelectedDay(isSel ? null : day)}
                >
                  <span className="ep-cal-day-num">{day}</span>
                  {cfg && cfg.icon && <span className="ep-cal-day-icon">{cfg.icon}</span>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="ep-att-legend">
            {Object.entries(statusConfig).filter(([k]) => k !== 'weekend').map(([k, v]) => (
              <div key={k} className="ep-att-legend-item">
                <span className="ep-att-legend-dot" style={{ background: v.color }}></span>
                <span>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="ep-card ep-att-detail-card">
          {selected && selectedDay ? (
            <>
              <div className="ep-att-detail-header">
                <h4>{selectedDay} {MONTHS[month]} {year}</h4>
                <span className="ep-att-status-chip" style={{ background: statusConfig[selected.status]?.bg, color: statusConfig[selected.status]?.color }}>
                  {statusConfig[selected.status]?.label}
                </span>
              </div>
              {selected.punchIn && (
                <div className="ep-att-detail-rows">
                  <div className="ep-att-detail-row">
                    <Clock size={16} />
                    <div>
                      <label>Punch In</label>
                      <span>{selected.punchIn}</span>
                    </div>
                  </div>
                  <div className="ep-att-detail-row">
                    <Clock size={16} />
                    <div>
                      <label>Punch Out</label>
                      <span>{selected.punchOut}</span>
                    </div>
                  </div>
                  <div className="ep-att-detail-row">
                    <CheckCircle size={16} />
                    <div>
                      <label>Working Hours</label>
                      <span>{selected.hours}</span>
                    </div>
                  </div>
                </div>
              )}
              {selected.status === 'leave' && (
                <div className="ep-att-detail-rows">
                  <div className="ep-att-detail-row">
                    <Calendar size={16} />
                    <div><label>Leave Type</label><span>{selected.leaveType}</span></div>
                  </div>
                </div>
              )}
              {selected.status === 'absent' && (
                <div className="ep-att-absent-note">
                  <XCircle size={16} />
                  <span>Marked absent for this day.</span>
                </div>
              )}
            </>
          ) : (
            <div className="ep-att-detail-empty">
              <Calendar size={40} />
              <p>Click on a day to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
