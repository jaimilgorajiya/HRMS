import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/ManageShift.css';

const Shift = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedShifts, setSelectedShifts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/shifts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setShifts(data.shifts);
            }
        } catch (error) {
            console.error("Error fetching shifts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Shift?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/shifts/delete/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Deleted!', 'Shift has been removed.', 'success');
                    fetchShifts();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete shift', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedShifts.length === 0) {
            Swal.fire('Warning', 'Please select shifts to delete', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: `Delete ${selectedShifts.length} Shift(s)?`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete all'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await Promise.all(
                    selectedShifts.map(id =>
                        fetch(`${apiUrl}/api/shifts/delete/${id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                    )
                );
                Swal.fire('Deleted!', 'Selected shifts have been removed.', 'success');
                setSelectedShifts([]);
                fetchShifts();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete shifts', 'error');
            }
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedShifts(filteredShifts.map(shift => shift._id));
        } else {
            setSelectedShifts([]);
        }
    };

    const handleSelectShift = (id) => {
        setSelectedShifts(prev =>
            prev.includes(id) ? prev.filter(shiftId => shiftId !== id) : [...prev, id]
        );
    };

    // Filter shifts
    const filteredShifts = shifts.filter(shift =>
        shift.shiftName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.shiftCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container">Loading...</div>;

    return (
        <div className="manage-shift-container">
            <div className="shift-header-bar">
                <h1 className="shift-title">Manage Shift</h1>
                <div className="header-actions">
                    <button className="btn-add" onClick={() => navigate('/admin/shift/add')}>
                        <Plus size={16} /> ADD
                    </button>
                    <button className="btn-delete" onClick={handleBulkDelete} disabled={selectedShifts.length === 0}>
                        <Trash2 size={16} /> DELETE
                    </button>
                </div>
            </div>

            <div className="table-controls">
                <div className="search-control">
                    <label>Search:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder=""
                    />
                </div>
            </div>

            <div className="table-wrapper">
                <table className="shift-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedShifts.length === filteredShifts.length && filteredShifts.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Sr. No</th>
                            <th>Action</th>
                            <th>Shift Code</th>
                            <th>Shift Name</th>
                            <th>Employees</th>
                            <th>Week Off</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShifts.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                    No shifts found
                                </td>
                            </tr>
                        ) : (
                            filteredShifts.map((shift, index) => (
                                <tr key={shift._id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedShifts.includes(shift._id)}
                                            onChange={() => handleSelectShift(shift._id)}
                                        />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => navigate(`/admin/shift/edit/${shift._id}`)}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(shift._id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td>{shift.shiftCode || `S${index + 1}`}</td>
                                    <td>{shift.shiftName}</td>
                                    <td>{shift.employeeCount || 0}</td>
                                    <td>{shift.weekOffDays?.join(', ') || shift.weekOffType}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Shift;
