import React from 'react';
import { Users, UserPlus, UserCheck, UserX, TrendingUp, Briefcase, Award, Clock } from 'lucide-react';

const EmployeeManagement = () => {
    // This could be a dashboard for employee management
    const stats = [
        { title: 'Total Employees', value: '124', icon: Users, color: '#3B82F6', bg: '#EFF6FF' },
        { title: 'Active', value: '118', icon: UserCheck, color: '#10B981', bg: '#ECFDF5' },
        { title: 'Onboarding', value: '4', icon: UserPlus, color: '#F59E0B', bg: '#FFFBEB' },
        { title: 'Ex-Employees', value: '25', icon: UserX, color: '#EF4444', bg: '#FEF2F2' },
    ];

    return (
        <div className="hrm-container">
            <div className="hrm-header">
                <div>
                    <h1 className="hrm-title">Employee Management</h1>
                    <p className="hrm-subtitle">Overview and management of employee operations</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="hrm-card" style={{ marginBottom: 0 }}>
                        <div className="hrm-card-body" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ background: stat.bg, padding: '15px', borderRadius: '12px' }}>
                                <stat.icon size={28} color={stat.color} />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>{stat.title}</div>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>{stat.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
                <div className="hrm-card">
                    <div className="hrm-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <TrendingUp size={20} color="#3B82F6" />
                            <h3 style={{ margin: 0 }}>Quick Actions</h3>
                        </div>
                    </div>
                    <div className="hrm-card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <button className="btn-hrm btn-hrm-secondary" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: 'auto' }}>
                                <UserPlus size={24} />
                                <span>Add Employee</span>
                            </button>
                            <button className="btn-hrm btn-hrm-secondary" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: 'auto' }}>
                                <Briefcase size={24} />
                                <span>Change Position</span>
                            </button>
                            <button className="btn-hrm btn-hrm-secondary" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: 'auto' }}>
                                <Award size={24} />
                                <span>Promotions</span>
                            </button>
                            <button className="btn-hrm btn-hrm-secondary" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: 'auto' }}>
                                <Clock size={24} />
                                <span>Shift History</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hrm-card">
                    <div className="hrm-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={20} color="#10B981" />
                            <h3 style={{ margin: 0 }}>Recent Activities</h3>
                        </div>
                    </div>
                    <div className="hrm-card-body" style={{ padding: '0 20px 20px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ display: 'flex', gap: '15px', padding: '12px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Users size={16} color="#64748B" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>New employee joined: John Doe</div>
                                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>2 hours ago • HR Department</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;
