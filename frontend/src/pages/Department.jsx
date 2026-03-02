import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, GripVertical, Building2, Layout } from 'lucide-react';
import Swal from 'sweetalert2';

const Department = () => {
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeBranchId, setActiveBranchId] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        branchId: ''
    });

    const [bulkDepartments, setBulkDepartments] = useState(['']);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [branchRes, deptRes] = await Promise.all([
                fetch(`${apiUrl}/api/branches`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${apiUrl}/api/departments`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const branchData = await branchRes.json();
            const deptData = await deptRes.json();

            if (branchData.success) setBranches(branchData.branches);
            if (deptData.success) {
                // Sort departments by order field from database
                setDepartments(deptData.departments.sort((a,b) => a.order - b.order));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const endpoint = isEditing ? `${apiUrl}/api/departments/${currentId}` : `${apiUrl}/api/departments/add`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: isEditing ? 'Department updated successfully.' : 'Department added successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                setFormData({ name: '', branchId: '' });
                setIsEditing(false);
                fetchInitialData();
            } else {
                Swal.fire('Error', data.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save department', 'error');
        }
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        const filteredDepts = bulkDepartments.filter(name => name.trim() !== '');
        if (filteredDepts.length === 0) {
            Swal.fire('Error', 'Please enter at least one department name', 'error');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${apiUrl}/api/departments/bulk-add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    departments: filteredDepts,
                    branchId: formData.branchId 
                })
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Departments added successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setIsBulkModalOpen(false);
                setBulkDepartments(['']);
                setFormData({ name: '', branchId: '' });
                fetchInitialData();
            } else {
                Swal.fire('Error', data.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save departments', 'error');
        }
    };

    const handleEdit = (dept) => {
        setFormData({
            name: dept.name,
            branchId: dept.branchId
        });
        setCurrentId(dept._id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Department?',
            text: "All associated roles might be affected!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete department'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/departments/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Deleted!', 'Department has been removed.', 'success');
                    fetchInitialData();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete department', 'error');
            }
        }
    };

    const addBulkRow = () => setBulkDepartments([...bulkDepartments, '']);
    const removeBulkRow = (index) => {
        const updated = bulkDepartments.filter((_, i) => i !== index);
        setBulkDepartments(updated.length ? updated : ['']);
    };

    const handleBulkRowChange = (index, value) => {
        const updated = [...bulkDepartments];
        updated[index] = value;
        setBulkDepartments(updated);
    };

    if (loading) return <div className="loading-container">Loading Departments...</div>;

    return (
        <div className="designation-container">
            <div className="designation-header">
                <h1 className="profile-title">Departments</h1>
                <div className="header-actions">
                    <button className="btn-theme btn-theme-primary" onClick={() => { setIsBulkModalOpen(true); setFormData({ ...formData, branchId: branches[0]?._id }); }}><Plus size={16} /> Add Multiple Departments</button>
                </div>
            </div>

            <div className="department-branch-list">
                {branches.length === 0 ? (
                    <div className="empty-state">No branches found. Please add branches first.</div>
                ) : (
                    branches.filter(branch => departments.some(d => d.branchId === branch._id)).map(branch => {
                        const branchDepts = departments.filter(d => d.branchId === branch._id).sort((a,b) => a.order - b.order);
                        return (
                            <div key={branch._id} className="branch-dept-section">
                                <div className="branch-dept-header">
                                    <div className="branch-title-with-count">
                                        <h3>{branch.branchName.toUpperCase()} BRANCH</h3>
                                        <span className="dept-count">{branchDepts.length}</span>
                                    </div>
                                    <button className="branch-add-btn" onClick={() => { setIsEditing(false); setFormData({ name: '', branchId: branch._id }); setIsModalOpen(true); }}><Plus size={14} /> ADD</button>
                                </div>
                                <div className="dept-list-wrapper">
                                    <div className="dept-items-grid">
                                        {branchDepts.map((dept, index) => (
                                            <div key={dept._id} className="dept-item-card">
                                                <span className="dept-name">{dept.name}</span>
                                                <div className="dept-item-actions">
                                                    <button className="dept-icon-btn edit" onClick={() => handleEdit(dept)}><Edit2 size={14} /></button>
                                                    <button className="dept-icon-btn delete" onClick={() => handleDelete(dept._id)}><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Fallback if all branches have 0 departments */}
                {!loading && branches.length > 0 && !branches.some(branch => departments.some(d => d.branchId === branch._id)) && (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                        All branches currently have 0 departments. Use the "Add Multiple Departments" button to start.
                    </div>
                )}
            </div>

            {/* Single Add Modal */}
            {isModalOpen && (
                <div className="modal-theme-overlay">
                    <div className="modal-theme-content">
                        <div className="modal-theme-header">
                            <h2>{isEditing ? 'Edit Department' : 'Add New Department'}</h2>
                            <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-theme-body">
                                <div className="form-group-hrm" style={{ marginBottom: '20px' }}>
                                    <label>Branch <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <select className="form-control-hrm" name="branchId" value={formData.branchId} onChange={handleInputChange} required disabled={isEditing}>
                                        <option value="">-- Select Branch --</option>
                                        {branches.map(b => (
                                            <option key={b._id} value={b._id}>{b.branchName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group-hrm">
                                    <label>Department Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input type="text" className="form-control-hrm" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Sales" required />
                                </div>
                            </div>
                            <div className="modal-theme-footer">
                                <button type="button" className="btn-theme btn-theme-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-theme btn-theme-primary"><Check size={18} /> {isEditing ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Add Modal */}
            {isBulkModalOpen && (
                <div className="modal-theme-overlay">
                    <div className="modal-theme-content" style={{ width: '700px' }}>
                        <div className="modal-theme-header">
                            <h2>Add Multiple Departments</h2>
                            <button className="icon-btn" onClick={() => setIsBulkModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleBulkSubmit}>
                            <div className="modal-theme-body">
                                <div className="form-group-hrm" style={{ marginBottom: '24px' }}>
                                    <label>Branch <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <select className="form-control-hrm" name="branchId" value={formData.branchId} onChange={handleInputChange} required>
                                        <option value="">-- Select Branch --</option>
                                        {branches.map(b => (
                                            <option key={b._id} value={b._id}>{b.branchName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="bulk-dept-rows">
                                    <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>Department Names</label>
                                    {bulkDepartments.map((val, idx) => (
                                        <div key={idx} className="bulk-row">
                                            <input 
                                                type="text" 
                                                className="form-control-hrm" 
                                                value={val} 
                                                onChange={(e) => handleBulkRowChange(idx, e.target.value)} 
                                                placeholder={`Department ${idx + 1}`}
                                                required={idx === 0}
                                            />
                                            {bulkDepartments.length > 1 && (
                                                <button type="button" className="btn-remove-row" onClick={() => removeBulkRow(idx)}><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="btn-add-row" onClick={addBulkRow}><Plus size={16} /> Add More Row</button>
                                </div>
                            </div>
                            <div className="modal-theme-footer">
                                <button type="button" className="btn-theme btn-theme-secondary" onClick={() => setIsBulkModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-theme btn-theme-primary"><Check size={18} /> Save All</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Department;
