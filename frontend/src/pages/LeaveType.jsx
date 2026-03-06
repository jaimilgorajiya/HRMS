import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, Filter, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import SearchableSelect from '../components/SearchableSelect';

const LeaveType = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        shortName: '',
        attachmentRequired: 'No',
        applyOnHoliday: 'No',
        applicableFor: 'All',
        isBirthdayAnniversary: false,
        description: '',
        applyOnPastDays: 'No'
    });

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/leave-types`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setLeaveTypes(data);
            }
        } catch (error) {
            console.error("Error fetching leave types:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' || type === 'radio' && name === 'isBirthdayAnniversary' ? (value === 'true') : value
        });
    };

    const handleRadioChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isEditing ? `${apiUrl}/api/leave-types/${currentId}` : `${apiUrl}/api/leave-types`;
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
                    text: data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                resetForm();
                fetchLeaveTypes();
            } else {
                Swal.fire('Error', data.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save leave type', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            shortName: '',
            attachmentRequired: 'No',
            applyOnHoliday: 'No',
            applicableFor: 'All',
            isBirthdayAnniversary: false,
            description: '',
            applyOnPastDays: 'No'
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (lt) => {
        setFormData({
            name: lt.name,
            shortName: lt.shortName || '',
            attachmentRequired: lt.attachmentRequired || 'No',
            applyOnHoliday: lt.applyOnHoliday || 'No',
            applicableFor: lt.applicableFor || 'All',
            isBirthdayAnniversary: lt.isBirthdayAnniversary || false,
            description: lt.description || '',
            applyOnPastDays: lt.applyOnPastDays || 'No'
        });
        setCurrentId(lt._id);
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
                const response = await fetch(`${apiUrl}/api/leave-types/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Deleted!', 'Leave type has been deleted.', 'success');
                    fetchLeaveTypes();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete leave type', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            Swal.fire('Info', 'Please select items to delete', 'info');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${selectedIds.length} selected items!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete selected!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${apiUrl}/api/leave-types/bulk-delete`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ ids: selectedIds })
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Deleted!', data.message, 'success');
                    setSelectedIds([]);
                    fetchLeaveTypes();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete selected items', 'error');
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const isActive = currentStatus === 'Active';
        const result = await Swal.fire({
            title: isActive ? 'Deactivate Leave Type?' : 'Activate Leave Type?',
            text: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this leave type?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#64748B',
            confirmButtonText: `Yes, ${isActive ? 'deactivate' : 'activate'} it!`
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${apiUrl}/api/leave-types/${id}/toggle-status`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: `Leave type ${isActive ? 'deactivated' : 'activated'} successfully.`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchLeaveTypes();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };

    const filteredData = leaveTypes.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.shortName && item.shortName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(paginatedData.map(item => item._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div style={{ padding: '0px', width: '100%', minHeight: '100vh', background: '#F8FAFC' }}>
            <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', margin: 0 }}>Leave Types</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        style={{ background: '#3B648B', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}
                    >
                        <Plus size={16} /> ADD
                    </button>
                    <button 
                        onClick={handleBulkDelete}
                        style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}
                    >
                        <Trash2 size={16} /> DELETE
                    </button>
                </div>
            </div>

            <div style={{ padding: '0 30px 40px' }}>
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)', border: '1px solid #E2E8F0' }}>
                    
                    {/* Table Filters */}
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ position: 'relative' }}>
                            <span style={{ marginRight: '10px', color: '#64748B', fontSize: '14px' }}>Search:</span>
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ border: '1.5px solid #E2E8F0', borderRadius: '6px', padding: '6px 12px', width: '250px', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1200px' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC' }}>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Sr. No</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                                            onChange={handleSelectAll}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Action</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Name</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Short Name</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Leaves</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Group</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Attachment</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Holiday</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Applicable For</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Past Days</th>
                                    <th style={{ padding: '12px 24px', color: '#64748B', fontWeight: '600', fontSize: '13px', borderBottom: '1.5px solid #E2E8F0' }}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="12" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>Loading...</td>
                                    </tr>
                                ) : paginatedData.length > 0 ? paginatedData.map((item, index) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '12px 24px', color: '#1E293B', fontSize: '14px' }}>{(currentPage - 1) * entriesPerPage + index + 1}</td>
                                        <td style={{ padding: '12px 24px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(item._id)}
                                                onChange={() => handleSelectRow(item._id)}
                                                style={{ cursor: 'pointer' }} 
                                            />
                                        </td>
                                        <td style={{ padding: '12px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="btn-action-edit"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => toggleStatus(item._id, item.status)}
                                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                                                >
                                                    {item.status === 'Active' ? <ToggleRight size={28} color="#22C55E" /> : <ToggleLeft size={28} color="#94A3B8" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 24px', color: '#1E293B', fontSize: '14px', fontWeight: '500' }}>{item.name}</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '14px' }}>{item.shortName || '--'}</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '14px' }}>0</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '14px' }}>Default</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '14px' }}>{item.attachmentRequired}</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '14px' }}>{item.applyOnHoliday}</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '14px' }}>{item.applicableFor}</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '14px' }}>{item.applyOnPastDays}</td>
                                        <td style={{ padding: '12px 24px', color: '#475569', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description || '--'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="12" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No data found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '6px 10px', border: '1.5px solid #E2E8F0', borderRadius: '6px', background: 'white', cursor: 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentPage(i + 1)}
                                    style={{ 
                                        padding: '6px 12px', border: '1.5px solid #E2E8F0', borderRadius: '6px', 
                                        background: currentPage === i + 1 ? '#3B648B' : 'white', 
                                        color: currentPage === i + 1 ? 'white' : '#1E293B',
                                        cursor: 'pointer', fontWeight: '600'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                style={{ padding: '6px 10px', border: '1.5px solid #E2E8F0', borderRadius: '6px', background: 'white', cursor: 'pointer', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1 }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '850px', maxWidth: '95%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ background: '#3B648B', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Leave Type</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Leave Type Name <span style={{ color: '#EF4444' }}>*</span></label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Leave Type Name"
                                        required 
                                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: '8px', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Leave Type Short Name</label>
                                    <input 
                                        type="text" 
                                        name="shortName"
                                        value={formData.shortName}
                                        onChange={handleInputChange}
                                        placeholder="Leave Type Short Name"
                                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: '8px', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <SearchableSelect 
                                        label="Attachment Required"
                                        required={true}
                                        options={[
                                            { label: 'No', value: 'No' },
                                            { label: 'Yes', value: 'Yes' }
                                        ]}
                                        value={formData.attachmentRequired}
                                        onChange={(val) => setFormData({ ...formData, attachmentRequired: val })}
                                        placeholder="Select Option"
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <SearchableSelect 
                                        label="Apply Leave On Holiday"
                                        required={true}
                                        options={[
                                            { label: 'No', value: 'No' },
                                            { label: 'Yes', value: 'Yes' }
                                        ]}
                                        value={formData.applyOnHoliday}
                                        onChange={(val) => setFormData({ ...formData, applyOnHoliday: val })}
                                        placeholder="Select Option"
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <SearchableSelect 
                                        label="Applicable For"
                                        required={true}
                                        options={[
                                            { label: 'All', value: 'All' },
                                            { label: 'Male Only', value: 'Male Only' },
                                            { label: 'Female Only', value: 'Female Only' },
                                            { label: 'Married', value: 'Married' },
                                            { label: 'Un-Married', value: 'Un-Married' },
                                            { label: 'Married Female Only', value: 'Married Female Only' },
                                            { label: 'Married Male Only', value: 'Married Male Only' }
                                        ]}
                                        value={formData.applicableFor}
                                        onChange={(val) => setFormData({ ...formData, applicableFor: val })}
                                        placeholder="Select Option"
                                        searchable={true}
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Is Birthday/Anniversary Leave <span style={{ color: '#EF4444' }}>*</span></label>
                                    <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                            <input 
                                                type="radio" 
                                                name="isBirthdayAnniversary" 
                                                value="false"
                                                checked={formData.isBirthdayAnniversary === false}
                                                onChange={() => handleRadioChange('isBirthdayAnniversary', false)}
                                                style={{ accentColor: '#3B648B' }}
                                            /> No
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                            <input 
                                                type="radio" 
                                                name="isBirthdayAnniversary" 
                                                value="true"
                                                checked={formData.isBirthdayAnniversary === true}
                                                onChange={() => handleRadioChange('isBirthdayAnniversary', true)}
                                                style={{ accentColor: '#3B648B' }}
                                            /> Yes (Applicable on Birthday/Anniversary date only)
                                        </label>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Leave Type Description</label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Leave Type Description"
                                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: '8px', outline: 'none', height: '100px', resize: 'vertical' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <SearchableSelect 
                                        label="Leave Applied On Past Days"
                                        required={true}
                                        options={[
                                            { label: 'No', value: 'No' },
                                            { label: 'Yes', value: 'Yes' }
                                        ]}
                                        value={formData.applyOnPastDays}
                                        onChange={(val) => setFormData({ ...formData, applyOnPastDays: val })}
                                        placeholder="Select Option"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', borderTop: '1px solid #F1F5F9', paddingTop: '30px' }}>
                                <button 
                                    type="submit"
                                    style={{ background: '#3B648B', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '600' }}
                                >
                                    <Check size={18} /> {isEditing ? 'UPDATE' : 'ADD'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveType;

