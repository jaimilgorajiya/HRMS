import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, AlertCircle, Minus } from 'lucide-react';
import Swal from 'sweetalert2';
import SearchableSelect from '../components/SearchableSelect';

const PenaltyRules = () => {
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState('');
    const [slabs, setSlabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingShifts, setFetchingShifts] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchShifts();
    }, []);

    useEffect(() => {
        if (selectedShift) {
            fetchPenaltyRules(selectedShift);
        } else {
            setSlabs([]);
        }
    }, [selectedShift]);

    const fetchShifts = async () => {
        try {
            setFetchingShifts(true);
            const response = await fetch(`${apiUrl}/api/shifts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setShifts(data.shifts);
            }
        } catch (error) {
            console.error("Error fetching shifts:", error);
            Swal.fire('Error', 'Failed to fetch shifts', 'error');
        } finally {
            setFetchingShifts(false);
        }
    };

    const fetchPenaltyRules = async (shiftId) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/penalty-rules/${shiftId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSlabs(data.penaltyRule.slabs || []);
            }
        } catch (error) {
            console.error("Error fetching penalty rules:", error);
            Swal.fire('Error', 'Failed to fetch penalty rules', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlab = () => {
        setSlabs([...slabs, {
            penaltyType: 'Auto Leave',
            minTime: '',
            maxTime: '',
            type: 'Flat',
            value: ''
        }]);
    };

    const handleRemoveSlab = (index) => {
        const newSlabs = slabs.filter((_, i) => i !== index);
        setSlabs(newSlabs);
    };

    const handleSlabChange = (index, field, value) => {
        const newSlabs = [...slabs];
        newSlabs[index] = { ...newSlabs[index], [field]: value };
        setSlabs(newSlabs);
    };

    const handleRemoveAllSlabs = async () => {
        if (!selectedShift) return;

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will remove all penalty slabs for this shift.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove all!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${apiUrl}/api/penalty-rules/${selectedShift}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setSlabs([]);
                    Swal.fire('Removed!', 'All penalty rules removed for this shift.', 'success');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to remove penalty rules', 'error');
            }
        }
    };

    const handleSave = async () => {
        if (!selectedShift) {
            Swal.fire('Warning', 'Please select a shift first', 'warning');
            return;
        }

        for (let slab of slabs) {
            const needsMaxTime = ['Late In Minutes', 'Break Penalty'].includes(slab.penaltyType);
            if (!slab.minTime || (needsMaxTime && !slab.maxTime) || !slab.value) {
                Swal.fire('Validation Error', 'Please fill all required fields in each slab', 'error');
                return;
            }
        }

        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/penalty-rules/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shiftId: selectedShift,
                    slabs
                })
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire('Success', 'Penalty rules saved successfully', 'success');
            } else {
                Swal.fire('Error', data.message || 'Failed to save penalty rules', 'error');
            }
        } catch (error) {
            console.error("Error saving penalty rules:", error);
            Swal.fire('Error', 'Failed to save penalty rules', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingShifts) return <div className="loading-container">Loading Shifts...</div>;

    return (
        <div className="designation-container">
            <div className="designation-header">
                <h1 className="profile-title">Penalty Rules</h1>
            </div>

            <div className="designation-card" style={{ marginTop: '20px', overflow: 'visible' }}>
                <div className="penalty-rules-form" style={{ padding: '30px' }}>
                    <div className="row-hrm" style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '30px' }}>
                        <div className="form-group-hrm" style={{ flex: 1, maxWidth: '400px' }}>
                            <SearchableSelect 
                                label="Shift Name"
                                options={shifts.map(shift => ({ label: shift.shiftName, value: shift._id }))}
                                value={selectedShift}
                                onChange={(val) => setSelectedShift(val)}
                                placeholder="-- Select Shift --"
                            />
                        </div>
                        {selectedShift && slabs.length > 0 && (
                            <button 
                                className="btn-theme" 
                                style={{ 
                                    height: '48px', 
                                    padding: '0 24px', 
                                    background: '#ff4d4f', 
                                    color: 'white',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    letterSpacing: '0.5px'
                                }}
                                onClick={handleRemoveAllSlabs}
                            >
                                REMOVE ALL SLABS
                            </button>
                        )}
                    </div>

                    {selectedShift && (
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '30px' }}>
                            <div className="penalty-slabs-container">
                                {slabs.map((slab, index) => (
                                    <div key={index} className="slab-row-wrapper" style={{ marginBottom: '30px' }}>
                                        {/* Row 1 */}
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: ['Late In Minutes', 'Break Penalty'].includes(slab.penaltyType) ? '1.2fr 1fr 1fr 1fr' : '1.2fr 1fr 1fr 1fr 0.4fr', 
                                            gap: '25px', 
                                            marginBottom: '15px',
                                            alignItems: 'flex-end'
                                        }}>
                                            <div className="form-group-hrm">
                                                <SearchableSelect 
                                                    label="Penalty Type"
                                                    options={[
                                                        { label: 'Auto Leave', value: 'Auto Leave' },
                                                        { label: 'Late In Minutes', value: 'Late In Minutes' },
                                                        { label: 'Rejected Attendance', value: 'Rejected Attendance' },
                                                        { label: 'Break Penalty', value: 'Break Penalty' },
                                                        { label: 'Task Due Date', value: 'Task Due Date' }
                                                    ]}
                                                    value={slab.penaltyType}
                                                    onChange={(val) => handleSlabChange(index, 'penaltyType', val)}
                                                />
                                            </div>

                                            {/* Dynamic Field 1: Minimum Time / No of Attendance / Ratio */}
                                            <div className="form-group-hrm">
                                                <label>
                                                    {slab.penaltyType === 'Auto Leave' || slab.penaltyType === 'Rejected Attendance' ? 'No of Attendance/Leave' : 
                                                     slab.penaltyType === 'Task Due Date' ? 'Missed Deadline Task Ratio(%)' : 
                                                     'Minimum Time (In Minutes)'} <span style={{ color: 'var(--danger)' }}>*</span>
                                                </label>
                                                <input 
                                                    type="number" 
                                                    className="form-control-hrm"
                                                    placeholder="05"
                                                    value={slab.minTime}
                                                    onChange={(e) => handleSlabChange(index, 'minTime', e.target.value)}
                                                />
                                            </div>

                                            {/* Dynamic Field 2: Maximum Time (Only for certain types) */}
                                            {['Late In Minutes', 'Break Penalty'].includes(slab.penaltyType) ? (
                                                <div className="form-group-hrm">
                                                    <label>Maximum Time (In Minutes) <span style={{ color: 'var(--danger)' }}>*</span></label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control-hrm"
                                                        placeholder="45"
                                                        value={slab.maxTime}
                                                        onChange={(e) => handleSlabChange(index, 'maxTime', e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="form-group-hrm">
                                                    <SearchableSelect 
                                                        label="Type"
                                                        options={[
                                                            { label: 'Flat', value: 'Flat' },
                                                            { label: 'Percentage', value: 'Percentage' },
                                                            { label: 'Per Minute (Flat Amount)', value: 'Per Minute (Flat Amount)' },
                                                            { label: 'Per Minute (As Per Salary)', value: 'Per Minute (As Per Salary)' }
                                                        ]}
                                                        value={slab.type}
                                                        onChange={(val) => handleSlabChange(index, 'type', val)}
                                                    />
                                                </div>
                                            )}

                                            {/* Dynamic Field 3: Type (for types with maxTime) or Value (for others) */}
                                            {['Late In Minutes', 'Break Penalty'].includes(slab.penaltyType) ? (
                                                <div className="form-group-hrm">
                                                    <SearchableSelect 
                                                        label="Type"
                                                        options={[
                                                            { label: 'Flat', value: 'Flat' },
                                                            { label: 'Percentage', value: 'Percentage' },
                                                            { label: 'Per Minute (Flat Amount)', value: 'Per Minute (Flat Amount)' },
                                                            { label: 'Per Minute (As Per Salary)', value: 'Per Minute (As Per Salary)' }
                                                        ]}
                                                        value={slab.type}
                                                        onChange={(val) => handleSlabChange(index, 'type', val)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="form-group-hrm">
                                                    <label>Penalty Value <span style={{ color: 'var(--danger)' }}>*</span></label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control-hrm"
                                                        placeholder="150"
                                                        value={slab.value}
                                                        onChange={(e) => handleSlabChange(index, 'value', e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {/* Remove Button for Single-Row Layouts */}
                                            {!['Late In Minutes', 'Break Penalty'].includes(slab.penaltyType) && (
                                                <button 
                                                    className="btn-remove-slab" 
                                                    style={{ 
                                                        background: '#fee2e2', 
                                                        color: '#ff4d4f', 
                                                        border: '1px solid #fecaca', 
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onClick={() => handleRemoveSlab(index)}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ff4d4f'; e.currentTarget.style.color = 'white'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ff4d4f'; }}
                                                >
                                                    <Minus size={20} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Row 2: Penalty Value (Only for Multi-Row Layouts) */}
                                        {['Late In Minutes', 'Break Penalty'].includes(slab.penaltyType) && (
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                                                <div className="form-group-hrm" style={{ width: 'calc(25% - 15px)' }}>
                                                    <label>Penalty Value <span style={{ color: 'var(--danger)' }}>*</span></label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control-hrm"
                                                        placeholder="150"
                                                        value={slab.value}
                                                        onChange={(e) => handleSlabChange(index, 'value', e.target.value)}
                                                    />
                                                </div>
                                                <button 
                                                    className="btn-remove-slab" 
                                                    style={{ 
                                                        background: '#fee2e2', 
                                                        color: '#ff4d4f', 
                                                        border: '1px solid #fecaca', 
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onClick={() => handleRemoveSlab(index)}
                                                    onMouseEnter={(e) => { e.target.style.background = '#ff4d4f'; e.target.style.color = 'white'; }}
                                                    onMouseLeave={(e) => { e.target.style.background = '#fee2e2'; e.target.style.color = '#ff4d4f'; }}
                                                >
                                                    <Minus size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button 
                                className="add-slab-btn" 
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#1e40af', 
                                    fontWeight: '800', 
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '10px',
                                    padding: '10px 0'
                                }}
                                onClick={handleAddSlab}
                            >
                                <span style={{ fontSize: '18px' }}>+</span> ADD MORE PENALTY SLAB
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                                <button 
                                    className="btn-theme btn-theme-primary" 
                                    style={{ 
                                        padding: '12px 40px', 
                                        gap: '12px',
                                        fontSize: '16px',
                                        background: '#2c5282',
                                        borderRadius: '8px'
                                    }}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    <Save size={20} /> {loading ? 'SAVING...' : 'SAVE'}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {!selectedShift && !loading && (
                        <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
                            <AlertCircle size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                            <p style={{ fontSize: '16px' }}>Please select a shift to view or manage penalty rules.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PenaltyRules;
