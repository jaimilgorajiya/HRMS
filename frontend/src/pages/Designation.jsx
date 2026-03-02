import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, X, Check, Search } from 'lucide-react';
import Swal from 'sweetalert2';
// Global CSS in index.css

const Designation = () => {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDesignations, setSelectedDesignations] = useState([]);

    const [formData, setFormData] = useState({
        designationName: '',
        designationAlias: '',
        jobDescription: ''
    });

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";

    useEffect(() => {
        fetchDesignations();
    }, []);

    const fetchDesignations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/designations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setDesignations(data.designations);
            }
        } catch (error) {
            console.error("Error fetching designations:", error);
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
        const endpoint = isEditing ? `${apiUrl}/api/designations/${currentId}` : `${apiUrl}/api/designations/add`;
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
                    text: isEditing ? 'Designation updated successfully.' : 'Designation added successfully.',
                    icon: 'success',
                    confirmButtonColor: '#2563EB',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                setFormData({ designationName: '', designationAlias: '', jobDescription: '' });
                setIsEditing(false);
                fetchDesignations();
            } else {
                Swal.fire('Error', data.error || 'Something went wrong', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save designation', 'error');
        }
    };

    const handleEdit = (designation) => {
        setFormData({
            designationName: designation.designationName,
            designationAlias: designation.designationAlias || '',
            jobDescription: designation.jobDescription || ''
        });
        setCurrentId(designation._id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/designations/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Deleted!', 'Designation has been deleted.', 'success');
                    fetchDesignations();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete designation', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedDesignations.length === 0) {
            Swal.fire({
                title: 'No Selection',
                text: 'Please select at least one designation to delete.',
                icon: 'info',
                confirmButtonColor: '#2563EB'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${selectedDesignations.length} designations!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete all!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                for (let id of selectedDesignations) {
                    await fetch(`${apiUrl}/api/designations/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
                Swal.fire('Deleted!', 'Designations deleted.', 'success');
                setSelectedDesignations([]);
                fetchDesignations();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete some designations', 'error');
            }
        }
    };

    const toggleSelectAll = () => {
        if (selectedDesignations.length === filteredDesignations.length) {
            setSelectedDesignations([]);
        } else {
            setSelectedDesignations(filteredDesignations.map(d => d._id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedDesignations.includes(id)) {
            setSelectedDesignations(selectedDesignations.filter(i => i !== id));
        } else {
            setSelectedDesignations([...selectedDesignations, id]);
        }
    };

    const filteredDesignations = designations.filter(d => 
        d.designationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.designationAlias && d.designationAlias.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredDesignations.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredDesignations.length / entriesPerPage);

    return (
        <div className="designation-container">
            <div className="designation-header">
                <h1 className="profile-title">Designation</h1>
                <div className="header-actions">
                    <button className="btn-theme btn-theme-secondary"><Upload size={16} /> Import Bulk</button>
                    <button className="btn-theme btn-theme-primary" onClick={() => { setIsEditing(false); setFormData({ designationName: '', designationAlias: '', jobDescription: '' }); setIsModalOpen(true); }}><Plus size={16} /> Add</button>
                    <button className="btn-theme btn-theme-danger" onClick={handleBulkDelete}><Trash2 size={16} /> Delete</button>
                </div>
            </div>

            <div className="designation-card">
                <div className="table-controls">

                    <div className="search-control">
                        <div className="search-wrapper">
                            <Search size={16} color="var(--text-light)" />
                            <input type="text" placeholder="Search designations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="designation-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th><input type="checkbox" checked={selectedDesignations.length > 0 && selectedDesignations.length === filteredDesignations.length} onChange={toggleSelectAll} /></th>
                                <th>Code</th>
                                <th>Designation</th>
                                <th>Designation Alias</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td></tr>
                            ) : currentEntries.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No records found</td></tr>
                            ) : (
                                currentEntries.map((d, index) => (
                                    <tr key={d._id}>
                                        <td>{indexOfFirstEntry + index + 1}</td>
                                        <td><input type="checkbox" checked={selectedDesignations.includes(d._id)} onChange={() => toggleSelect(d._id)} /></td>
                                        <td><span className="percentage" style={{ border: 'none', background: '#F1F5F9', color: 'var(--text-main)' }}>{d.designationCode}</span></td>
                                        <td style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{d.designationName}</td>
                                        <td>{d.designationAlias || '-'}</td>
                                        <td>
                                            <button className="btn-action btn-edit-theme" onClick={() => handleEdit(d)}><Edit2 size={14} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="designation-footer">
                    <div>Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredDesignations.length)} of {filteredDesignations.length} entries</div>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            ))}
                            <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-theme-overlay">
                    <div className="modal-theme-content">
                        <div className="modal-theme-header">
                            <h2>{isEditing ? 'Edit Designation' : 'Add New Designation'}</h2>
                            <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-theme-body">
                                <div className="form-group-hrm" style={{ marginBottom: '20px' }}>
                                    <label>Designation Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input type="text" className="form-control-hrm" name="designationName" value={formData.designationName} onChange={handleInputChange} placeholder="e.g. Software Engineer" required />
                                </div>
                                <div className="form-group-hrm" style={{ marginBottom: '20px' }}>
                                    <label>Designation Alias</label>
                                    <input type="text" className="form-control-hrm" name="designationAlias" value={formData.designationAlias} onChange={handleInputChange} placeholder="e.g. SE" />
                                </div>
                                <div className="form-group-hrm">
                                    <label>Job Description</label>
                                    <textarea className="form-control-hrm textarea-hrm" name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} placeholder="Describe the roles and responsibilities..." style={{ minHeight: '120px' }}></textarea>
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

export default Designation;
