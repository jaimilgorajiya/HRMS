import { useNavigate } from 'react-router-dom';
import authenticatedFetch from '../utils/apiHandler';
import API_URL from '../config/api';
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Mail, Phone, MapPin, Building2, User, MoreVertical, Edit2, Trash2, Eye, UserCircle, Briefcase, Download, Upload, CreditCard, RotateCcw } from 'lucide-react';
import Swal from 'sweetalert2';

const Employees = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeBranchId, setActiveBranchId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [userRes, branchRes, deptRes] = await Promise.all([
                authenticatedFetch(`${API_URL}/api/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
                authenticatedFetch(`${API_URL}/api/branches`, { headers: { 'Authorization': `Bearer ${token}` } }),
                authenticatedFetch(`${API_URL}/api/departments`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const userData = await userRes.json();
            const branchData = await branchRes.json();
            const deptData = await deptRes.json();

            if (userData.success) setEmployees(userData.users);
            if (branchData.success && branchData.branches.length > 0) {
                setBranches(branchData.branches);
                setActiveBranchId(branchData.branches[0]._id);
            }
            if (deptData.success) setDepartments(deptData.departments);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const employeesByBranch = useMemo(() => {
        const activeBranch = branches.find(b => b._id === activeBranchId);
        if (!activeBranch) return {};

        const branchEmployees = employees.filter(emp => 
            emp.workSetup?.location === activeBranch.branchName || 
            emp.workSetup?.location === activeBranch._id ||
            emp.branch === activeBranch.branchName ||
            emp.branch === activeBranch._id
        );

        const grouped = {};
        // Group by department name
        branchEmployees.forEach(emp => {
            const deptName = emp.department || 'Unassigned';
            if (!grouped[deptName]) grouped[deptName] = [];
            grouped[deptName].push(emp);
        });

        return grouped;
    }, [employees, activeBranchId, branches]);

    if (loading) return <div className="loading-container">Loading Employees...</div>;

    return (
        <div className="hrm-container">
            {/* Standard Header Section */}
            <div className="hrm-header">
                <h1 className="hrm-title">Employees</h1>
                <div className="hrm-header-actions">
                    <button className="btn-hrm btn-hrm-primary" onClick={() => navigate('/admin/employees/add')}>
                        <Plus size={18} /> ADD
                    </button>
                </div>
            </div>

            {/* Branch Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '35px', padding: '4px', background: 'transparent', overflowX: 'auto' }}>
                {branches.map(branch => {
                    const isActive = activeBranchId === branch._id;
                    const count = employees.filter(emp => 
                        emp.workSetup?.location === branch.branchName || 
                        emp.workSetup?.location === branch._id ||
                        emp.branch === branch.branchName ||
                        emp.branch === branch._id
                    ).length;
                    
                    return (
                        <button 
                            key={branch._id} 
                            onClick={() => setActiveBranchId(branch._id)}
                            style={{
                                padding: '8px 24px',
                                borderRadius: '30px',
                                border: isActive ? 'none' : '1px solid #E2E8F0',
                                background: isActive ? '#3B648B' : 'white',
                                color: isActive ? 'white' : '#64748B',
                                fontWeight: '700',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                boxShadow: isActive ? '0 4px 12px rgba(59, 100, 139, 0.25)' : 'none'
                            }}
                        >
                            {branch.branchName} 
                            <span style={{ 
                                background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#F1F5F9', 
                                color: isActive ? 'white' : '#64748B', 
                                padding: '2px 8px', 
                                borderRadius: '6px', 
                                fontSize: '12px',
                                fontWeight: '700'
                            }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Department Groups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
                {Object.entries(employeesByBranch).length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '120px 0', 
                        color: '#94A3B8', 
                        background: 'white', 
                        borderRadius: '24px',
                        border: '2px dashed #E2E8F0'
                    }}>
                        <User size={48} style={{ marginBottom: '15px', opacity: 0.3 }} />
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>No employees connected to this branch yet.</p>
                    </div>
                ) : (
                    Object.entries(employeesByBranch).map(([deptName, deptEmployees]) => (
                        <div key={deptName}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                                <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                    {deptName} <span style={{ color: '#94A3B8', fontWeight: '600' }}>({deptEmployees.length})</span>
                                </h2>
                                <button style={{ 
                                    background: '#F97316', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    color: 'white', 
                                    width: '32px', 
                                    height: '32px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}>
                                    <RotateCcw size={16} style={{ transform: 'rotate(90deg)' }} />
                                </button>
                            </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {deptEmployees.map((emp) => (
                                        <div 
                                            key={emp._id} 
                                            className="bio-capsule" 
                                            onClick={() => navigate(`/admin/employees/profile/${emp._id}`)}
                                            style={{ 
                                                background: '#fff', 
                                                borderRadius: '100px', 
                                                padding: '12px 12px 12px 24px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                border: '1.5px solid #F1F5F9',
                                                boxShadow: '0 8px 15px -5px rgba(0, 0, 0, 0.02)',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {/* Profile & Identity */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                                <div style={{ 
                                                    position: 'relative',
                                                    width: '56px',
                                                    height: '56px'
                                                }}>
                                                    {/* Animated Status Ring */}
                                                    <div style={{ 
                                                        position: 'absolute',
                                                        inset: -3,
                                                        borderRadius: '50%',
                                                        border: `2px solid ${emp.status === 'Active' ? '#10B981' : '#CBD5E1'}`,
                                                        opacity: 0.3
                                                    }} />
                                                    <div style={{ 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        borderRadius: '50%', 
                                                        overflow: 'hidden', 
                                                        background: '#F1F5F9',
                                                        border: '2px solid #fff',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {emp.profilePhoto ? (
                                                            <img src={`${API_URL}/${emp.profilePhoto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#3B648B' }}>{getInitials(emp.name)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.3px' }}>{emp.name}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ 
                                                            fontSize: '11px', 
                                                            fontWeight: '700', 
                                                            color: '#3B648B', 
                                                            backgroundColor: 'rgba(59, 100, 139, 0.08)',
                                                            padding: '2px 8px',
                                                            borderRadius: '6px',
                                                            textTransform: 'uppercase'
                                                        }}>{emp.employeeId || 'IIPL-000'}</span>
                                                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>• {emp.employmentType || 'Permanent'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Role Info - Distinct Pill */}
                                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                                <div style={{ 
                                                    padding: '8px 20px', 
                                                    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                                    borderRadius: '50px',
                                                    border: '1px solid #E2E8F0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                        <Briefcase size={14} color="#3B648B" strokeWidth={2.5} />
                                                    </div>
                                                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>{emp.designation || 'Specialist'}</span>
                                                </div>
                                            </div>

                                            {/* Contact Details */}
                                            <div style={{ flex: 1, display: 'flex', gap: '30px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Email Address</span>
                                                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>{emp.email || 'not-provided@iipl.com'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <style dangerouslySetInnerHTML={{ __html: `
                                    .bio-capsule:hover {
                                        transform: scale(1.01) translateX(5px);
                                        background-color: #fff;
                                        border-color: #3B648B40;
                                        box-shadow: 0 15px 30px -10px rgba(59, 100, 139, 0.12);
                                    }
                                    .hub-btn {
                                        width: 50px;
                                        height: 50px;
                                        border-radius: 50%;
                                        border: none;
                                        background: #F8FAFC;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        cursor: pointer;
                                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                    }
                                    .hub-btn:hover {
                                        background-color: var(--hover-color);
                                        transform: rotate(15deg) scale(1.1);
                                    }
                                `}} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Employees;
