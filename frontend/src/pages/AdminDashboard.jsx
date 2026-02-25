import React from 'react';
import AdminLayout from '../layout/AdminLayout';
import '../styles/admin.css';

const AdminDashboard = () => {
  const stats = [
    { title: "Total responses", value: "2 436", trend: "+15%", subtitle: "of candidates for the period", type: "positive" },
    { title: "Responses today", value: "98", trend: "-10%", subtitle: "candidates left a response", type: "negative" },
    { title: "Total vacancies", value: "49", trend: "-10%", subtitle: "active and closed vacancies", type: "negative" },
    { title: "Closed vacancies", value: "18 out of 49", progress: 36, type: "normal" }
  ];

  return (
    <>
      <div className="dashboard-controls">
        <div className="date-picker">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          September, 2022
        </div>
        <div className="filter-dropdown">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filter: All Companies
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              {stat.trend && <span className={`stat-trend ${stat.type}`}>{stat.trend}</span>}
            </div>
            <div className="stat-value">{stat.value}</div>
            {stat.subtitle && <div className="stat-subtitle">{stat.subtitle}</div>}
            {stat.progress !== undefined && (
              <div className="stat-progress-container">
                <div className="stat-progress-bar" style={{ width: `${stat.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="grid-card main-chart">
          <div className="card-header">
            <h3>Candidate statistics</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot received"></span> Received responses</span>
              <span className="legend-item"><span className="dot hired"></span> Candidates hired</span>
            </div>
          </div>
          <div className="mock-chart">
             {/* Mock chart representation */}
             <div className="chart-bars">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="bar-group">
                    <div className="bar background" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                    <div className="bar foreground" style={{ height: `${5 + Math.random() * 20}%` }}></div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="grid-card side-card">
          <div className="card-header">
            <h3>Candidate Source</h3>
          </div>
          <div className="mock-pie-container">
            <div className="pie-chart">
              <div className="pie-center">1 340</div>
            </div>
            <ul className="source-list">
              <li><span className="dot source-1"></span> HH.ru <span className="source-val">685</span></li>
              <li><span className="dot source-2"></span> Getmatch <span className="source-val">294</span></li>
              <li><span className="dot source-3"></span> LinkedIn <span className="source-val">105</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid bottom">
        <div className="grid-card recruiters">
          <div className="card-header">
              <h3>Recruiters rating</h3>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Recruiter</th>
                  <th>Active vacancies</th>
                  <th>Number of responses</th>
                  <th>Employees hired</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="user-cell">
                    <img src="https://ui-avatars.com/api/?name=John+Smith&background=random" alt="" />
                    John Smith
                  </td>
                  <td>8</td>
                  <td>283 <span className="trend positive">+36</span></td>
                  <td>
                    <div className="hired-cell">
                      8 из 10 <span className="percentage">80%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="user-cell">
                    <img src="https://ui-avatars.com/api/?name=Helga+Miller&background=random" alt="" />
                    Helga Miller
                  </td>
                  <td>3</td>
                  <td>280 <span className="trend positive">+42</span></td>
                  <td>
                    <div className="hired-cell">
                      2 из 4 <span className="percentage">50%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
