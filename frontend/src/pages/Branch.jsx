import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Building2, MapPin, Grip, GripVertical } from 'lucide-react';
import Swal from 'sweetalert2';

const Branch = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [isReordering, setIsReordering] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [formData, setFormData] = useState({
        branchName: '',
        branchCode: '',
        branchType: ''
    });

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/branches`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setBranches(data.branches);
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
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
        const endpoint = isEditing ? `${apiUrl}/api/branches/${currentId}` : `${apiUrl}/api/branches/add`;
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
                    text: isEditing ? 'Branch updated successfully.' : 'Branch added successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                setFormData({ branchName: '', branchCode: '', branchType: '' });
                setIsEditing(false);
                fetchBranches();
            } else {
                Swal.fire('Error', data.error || 'Something went wrong', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save branch', 'error');
        }
    };

    const handleEdit = (branch) => {
        setFormData({
            branchName: branch.branchName,
            branchCode: branch.branchCode || '',
            branchType: branch.branchType
        });
        setCurrentId(branch._id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Branch?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete branch'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/branches/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Deleted!', 'Branch has been removed.', 'success');
                    fetchBranches();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete branch', 'error');
            }
        }
    };

    const onDragStart = (e, index) => {
        setDraggedItem(branches[index]);
        e.dataTransfer.effectAllowed = "move";
        // Use e.currentTarget to ensure we get the card itself
        e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
        const draggedOverItem = branches[index];

        if (draggedItem === draggedOverItem) {
            return;
        }

        let items = branches.filter(item => item !== draggedItem);
        items.splice(index, 0, draggedItem);
        setBranches(items);
    };

    const onDragEnd = () => {
        setDraggedItem(null);
    };

    const handleSaveOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/branches/reorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reorderedBranches: branches.map((b, i) => ({ _id: b._id, order: i })) })
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Order updated successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setIsReordering(false);
                fetchBranches();
            } else {
                Swal.fire('Error', data.error || 'Failed to update order', 'error');
            }
        } catch (error) {
            console.error("Save order error:", error);
            Swal.fire('Error', 'Failed to save order', 'error');
        }
    };

    return (
        <div className="branch-container">
            <div className="designation-header">
                <h1 className="profile-title">Branches</h1>
                <div className="header-actions">
                    {isReordering ? (
                        <>
                            <button className="btn-theme btn-theme-primary" onClick={handleSaveOrder}><Check size={16} /> Save Order</button>
                            <button className="btn-theme btn-theme-secondary" onClick={() => { setIsReordering(false); fetchBranches(); }}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-theme btn-theme-secondary" onClick={() => setIsReordering(true)}>Change Order</button>
                            <button className="btn-theme btn-theme-primary" onClick={() => { setIsEditing(false); setFormData({ branchName: '', branchCode: '', branchType: '' }); setIsModalOpen(true); }}><Plus size={16} /> Add More Branch</button>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Loading branches...</div>
            ) : (
                <div className="branch-grid">
                    {branches.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                            No branches found. Add your first branch.
                        </div>
                    ) : (
                        branches.map((branch, index) => (
                            <div 
                                key={branch._id} 
                                className={`branch-card ${isReordering ? 'draggable' : ''} ${draggedItem === branch ? 'dragging' : ''}`}
                                draggable={isReordering}
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragOver={(e) => onDragOver(e, index)}
                                onDragEnd={onDragEnd}
                            >
                                {isReordering && (
                                    <div className="drag-handle">
                                        <GripVertical size={20} />
                                    </div>
                                )}
                                <Building2 size={32} color="var(--primary-blue)" />
                                <div className="branch-card-title">{branch.branchName}</div>
                                <div className="branch-card-type">{branch.branchType}</div>
                                {branch.branchCode && (
                                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Code: {branch.branchCode}</div>
                                )}
                                <div className="branch-card-actions">
                                    {!isReordering && (
                                        <>
                                            <button className="icon-btn" onClick={() => handleEdit(branch)}><Edit2 size={16} /></button>
                                            <button className="icon-btn btn-delete" onClick={() => handleDelete(branch._id)}><Trash2 size={16} /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-theme-overlay">
                    <div className="modal-theme-content">
                        <div className="modal-theme-header">
                            <h2>{isEditing ? 'Edit Branch' : 'Add New Branch'}</h2>
                            <button className="icon-btn" style={{ border: 'none' }} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-theme-body">
                                <div className="form-row">
                                    <div className="form-group-hrm">
                                        <label>Branch Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                                        <input type="text" className="form-control-hrm" name="branchName" value={formData.branchName} onChange={handleInputChange} placeholder="e.g. Pune Office" required />
                                    </div>
                                    <div className="form-group-hrm">
                                        <label>Branch Code</label>
                                        <input type="text" className="form-control-hrm" name="branchCode" value={formData.branchCode} onChange={handleInputChange} placeholder="e.g. PN-01" />
                                    </div>
                                </div>
                                <div className="form-group-hrm">
                                    <label>Branch Type <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <select className="form-control-hrm" name="branchType" value={formData.branchType} onChange={handleInputChange} required>
                                        <option value="">-- Select --</option>
                                        <option value="Non-Metro city">Non-Metro city</option>
                                        <option value="Metro city">Metro city</option>
                                    </select>
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
        </div>
    );
};

export default Branch;
