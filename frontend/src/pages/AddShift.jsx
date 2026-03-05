import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, RotateCcw } from 'lucide-react';
import ShiftTimePicker from '../components/ShiftTimePicker';
import HourMinutePicker from '../components/HourMinutePicker';
import HourDurationSelect from '../components/HourDurationSelect';
import Swal from 'sweetalert2';
import '../styles/AddShift.css';

const AddShift = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";

    const initialFormData = {
        shiftName: '',
        shiftCode: '',
        multiplePunchAllowed: false,
        requireOutOfRangeReason: false,
        hoursType: 'Full Shift Hours',
        attendanceOnProductiveHours: false,
        deductBreakIfNotTaken: false,
        deductFullBreakIfLessTaken: false,
        attendanceRequestRemarkPolicy: 'None',
        missingPunchRemarkPolicy: 'None',
        outOfRangeRemarkPolicy: 'None',
        missingPunchRequestDays: 0,
        pastAttendanceRequestDays: 0,
        autoSelectAlternateShift: false,
        allowAttendanceModification: false,
        weekOffType: 'Selected Weekdays',
        weekOffDays: [],
        weekOffsPerWeek: 0,
        weekOffsPerMonth: 0,
        hasAlternateWeekOff: false,
        lateEarlyType: 'Combined',
        maxLateInMinutes: 0,
        maxEarlyOutMinutes: 0,
        applyLeaveIfLimitExceeded: false,
        leaveTypeIfExceeded: 'Half Day',
        requireLateReason: false,
        requireEarlyOutReason: false,
        lateEarlyApplyOnExtraDay: false,
        deductLatePenaltyFromWorkHours: false,
        removeLateEarlyAfterFullHours: false,
        allowShortLeave: false,
        monthlyShortLeaves: 0,
        shortLeaveMinutes: 0,
        shortLeaveType: 'Default',
        shortLeaveBufferMinutes: 0,
        shortLeaveDays: '',
        applySandwichLeave: false,
        applyHalfDayBeforeFixedTimeout: false,
        applyLeaveOnHoliday: false,
        applyLeaveOnWeekOff: false,
        generatePenaltyOnAbsent: false,
        penaltyType: 'Flat',
        penaltyValue: 0,
        extraDayApprovalPolicy: 'None',
        needApprovalExtraHoursWeekdays: false,
        needOTRequestSameDay: false,
        otRequestType: 'Get approval before overtime work',
        extraPayoutMultiplier: 'Default',
        compOffOnExtraDay: false,
        compOffOnExtraHoursWorkingDay: false,
        compOffExpiryType: 'None',
        compOffExpireDays: 0,
        maxCompOffInMonth: 0,
        applyCompOffOnPastDate: false,
        excludeCompOffWithAutoLeave: false,
        breakMode: 'Defined Minutes',
        breakApprovalFaceApp: false,
        breakApprovalEmployeeApp: false,
        sameRulesForAllDays: false,
        flexibleShiftHours: false,
        schedule: {
            monday: {}, tuesday: {}, wednesday: {}, thursday: {}, 
            friday: {}, saturday: {}, sunday: {}
        }
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = value;
        if (type === 'checkbox') {
            finalValue = checked;
        } else if (type === 'number') {
            finalValue = Number(value);
        } else if (value === 'true') {
            finalValue = true;
        } else if (value === 'false') {
            finalValue = false;
        }

        setFormData(prev => {
            const updates = { [name]: finalValue };
            
            // Mutual exclusivity for shift rules
            if (name === 'sameRulesForAllDays' && finalValue === true) {
                updates.flexibleShiftHours = false;
            } else if (name === 'flexibleShiftHours' && finalValue === true) {
                updates.sameRulesForAllDays = false;
                // Optional: clear the table or reset when flexible is chosen
            }

            return {
                ...prev,
                ...updates
            };
        });
    };

    const handleWeekOffDaysChange = (day) => {
        setFormData(prev => ({
            ...prev,
            weekOffDays: prev.weekOffDays.includes(day)
                ? prev.weekOffDays.filter(d => d !== day)
                : [...prev.weekOffDays, day]
        }));
    };

    const handleScheduleChange = (day, field, value) => {
        setFormData(prev => {
            if (prev.sameRulesForAllDays) {
                const newSchedule = { ...prev.schedule };
                days.forEach(d => {
                    newSchedule[d] = {
                        ...newSchedule[d],
                        [field]: value
                    };
                });
                return {
                    ...prev,
                    schedule: newSchedule
                };
            }

            return {
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [day]: {
                        ...prev.schedule[day],
                        [field]: value
                    }
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/shifts/add`, {
                method: 'POST',
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
                    text: 'Shift created successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate('/admin/shift/manage');
            } else {
                Swal.fire('Error', data.message || 'Failed to create shift', 'error');
            }
        } catch (error) {
            console.error('Error creating shift:', error);
            Swal.fire('Error', 'Failed to create shift', 'error');
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="add-shift-container">
            <div className="shift-header">
                <h1 className="profile-title">Add Shift</h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* SECTION 1 - BASIC SHIFT DETAILS */}
                <div className="shift-card">
                    <h2 className="card-title">Basic Shift Details</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>Shift Name <span className="required">*</span></label>
                            <input
                                type="text"
                                name="shiftName"
                                value={formData.shiftName}
                                onChange={handleInputChange}
                                placeholder="Enter shift name"
                                required
                            />
                        </div>

                        <div className="form-group-shift">
                            <label>Shift Code</label>
                            <input
                                type="text"
                                name="shiftCode"
                                value={formData.shiftCode}
                                onChange={handleInputChange}
                                placeholder="e.g. S1, S2"
                            />
                        </div>

                        <div className="form-group-shift">
                            <label>Multiple Punch In/Out Allow</label>
                            <select name="multiplePunchAllowed" value={formData.multiplePunchAllowed} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Required Out Of Range Reason</label>
                            <select name="requireOutOfRangeReason" value={formData.requireOutOfRangeReason} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Hours Type In Shift Clock <span className="required">*</span></label>
                            <select name="hoursType" value={formData.hoursType} onChange={handleInputChange}>
                                <option value="Full Shift Hours">Full Shift Hours</option>
                                <option value="Flexible Hours">Minimum Full Day Hours</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Attendance Calculation On Productive Hours</label>
                            <select name="attendanceOnProductiveHours" value={formData.attendanceOnProductiveHours} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Deduct Break Time From Total Working Hours If Break Not Taken</label>
                            <select name="deductBreakIfNotTaken" value={formData.deductBreakIfNotTaken} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Deduct Full Break Time If Taken Break Time Is Less Than Assigned Time</label>
                            <select name="deductFullBreakIfLessTaken" value={formData.deductFullBreakIfLessTaken} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Attendance Request Approve With Remark</label>
                            <select name="attendanceRequestRemarkPolicy" value={formData.attendanceRequestRemarkPolicy} onChange={handleInputChange}>
                                <option value="None">None</option>
                                <option value="Optional">Optional</option>
                                <option value="Mandatory">Mandatory</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Punch Out Missing Request Approve With Remark</label>
                            <select name="missingPunchRemarkPolicy" value={formData.missingPunchRemarkPolicy} onChange={handleInputChange}>
                                <option value="None">None</option>
                                <option value="Optional">Optional</option>
                                <option value="Mandatory">Mandatory</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Pending Attendance (Out Of Range) Approve With Remark</label>
                            <select name="outOfRangeRemarkPolicy" value={formData.outOfRangeRemarkPolicy} onChange={handleInputChange}>
                                <option value="None">None</option>
                                <option value="Optional">Optional</option>
                                <option value="Mandatory">Mandatory</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Punch Out Missing Request Days</label>
                            <input
                                type="number"
                                name="missingPunchRequestDays"
                                value={formData.missingPunchRequestDays}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>

                        <div className="form-group-shift">
                            <label>Past Attendance Request Days</label>
                            <input
                                type="number"
                                name="pastAttendanceRequestDays"
                                value={formData.pastAttendanceRequestDays}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>

                        <div className="form-group-shift">
                            <label>Auto Select Alternate Shift (Max 2)</label>
                            <select name="autoSelectAlternateShift" value={formData.autoSelectAlternateShift} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Allow Attendance Modification</label>
                            <select name="allowAttendanceModification" value={formData.allowAttendanceModification} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 2 - WEEK OFF SETTINGS */}
                <div className="shift-card">
                    <h2 className="card-title">Week Off Settings</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>Week Off Type <span className="required">*</span></label>
                            <select name="weekOffType" value={formData.weekOffType} onChange={handleInputChange}>
                                <option value="Selected Weekdays">Selected Weekdays</option>
                              
                                <option value="Manual Week Off">Manual Week Off</option>
                                <option value="Auto Week off">Auto Week off</option>
                            </select>
                        </div>

                        {/* Show different fields based on Week Off Type */}
                        {formData.weekOffType === 'Selected Weekdays' && (
                            <>
                                <div className="form-group-shift full-width">
                                    <label>Week off Days</label>
                                    <div className="checkbox-group">
                                        {weekDays.map(day => (
                                            <label key={day} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.weekOffDays.includes(day)}
                                                    onChange={() => handleWeekOffDaysChange(day)}
                                                />
                                                <span>{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group-shift">
                                    <label>Has Alternate Week off <span className="required">*</span></label>
                                    <select name="hasAlternateWeekOff" value={formData.hasAlternateWeekOff} onChange={handleInputChange}>
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {(formData.weekOffType === 'Manual Week Off' || formData.weekOffType === 'Auto Week off') && (
                            <>
                                <div className="form-group-shift">
                                    <label>Number of week-offs allowed in a week <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        name="weekOffsPerWeek"
                                        value={formData.weekOffsPerWeek || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="7"
                                        placeholder="Enter number"
                                    />
                                </div>

                                <div className="form-group-shift">
                                    <label>Number of week-offs allowed in a month</label>
                                    <input
                                        type="number"
                                        name="weekOffsPerMonth"
                                        value={formData.weekOffsPerMonth || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="0 for no limit"
                                    />
                                    <small style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                                        0 for no limit, possible week-offs are allowed
                                    </small>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* SECTION 3 - LATE IN / EARLY OUT SETTINGS */}
                <div className="shift-card">
                    <h2 className="card-title">Late In / Early Out Settings</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>Late In Early Out Type</label>
                            <select name="lateEarlyType" value={formData.lateEarlyType} onChange={handleInputChange}>
                                <option value="Combined">Combined</option>
                                <option value="Separate">Separate</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Maximum Late In (Minutes)</label>
                            <input
                                type="number"
                                name="maxLateInMinutes"
                                value={formData.maxLateInMinutes}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>

                        <div className="form-group-shift">
                            <label>Maximum Early Out (Minutes)</label>
                            <input
                                type="number"
                                name="maxEarlyOutMinutes"
                                value={formData.maxEarlyOutMinutes}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>

                        <div className="form-group-shift">
                            <label>Apply Leave If Late/Early Limit Exceeded</label>
                            <select name="applyLeaveIfLimitExceeded" value={formData.applyLeaveIfLimitExceeded} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Leave Type When Limit Exceeded</label>
                            <select name="leaveTypeIfExceeded" value={formData.leaveTypeIfExceeded} onChange={handleInputChange}>
                                <option value="Half Day">Half Day</option>
                                <option value="Full Day">Full Day</option>
                                <option value="Short Leave">Quarter Day</option>
                                <option value="Short Leave">Three-Quarters Day</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Required Reason Of Late In</label>
                            <select name="requireLateReason" value={formData.requireLateReason} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Required Reason Of Early Out</label>
                            <select name="requireEarlyOutReason" value={formData.requireEarlyOutReason} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Late In Early Out Apply On Extra Day</label>
                            <select name="lateEarlyApplyOnExtraDay" value={formData.lateEarlyApplyOnExtraDay} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Late In Penalty Minutes Deduct From Working Hours</label>
                            <select name="deductLatePenaltyFromWorkHours" value={formData.deductLatePenaltyFromWorkHours} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Remove Late/Early When Completed Shift Hours</label>
                            <select name="removeLateEarlyAfterFullHours" value={formData.removeLateEarlyAfterFullHours} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 4 - LEAVE SETTINGS */}
                <div className="shift-card">
                    <h2 className="card-title">Leave Settings</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>
                                Allow Short Leave 
                                <span className="info-icon-wrapper" title="Policy for allowing short duration leaves">
                                    <i className="fas fa-info-circle"></i>
                                </span>
                            </label>
                            <select name="allowShortLeave" value={formData.allowShortLeave} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        {/* Show additional fields when Allow Short Leave is Yes */}
                        {(formData.allowShortLeave === true || formData.allowShortLeave === 'true') && (
                            <>
                                <div className="form-group-shift">
                                    <label>Number of Monthly Short Leaves</label>
                                    <input
                                        type="number"
                                        name="monthlyShortLeaves"
                                        value={formData.monthlyShortLeaves || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="Enter number"
                                    />
                                </div>

                                <div className="form-group-shift">
                                    <label>Short Leave Minutes (After/Before Shift Time)</label>
                                    <input
                                        type="number"
                                        name="shortLeaveMinutes"
                                        value={formData.shortLeaveMinutes || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="Enter minutes"
                                    />
                                </div>

                                <div className="form-group-shift">
                                    <label>Short Leave Type</label>
                                    <select name="shortLeaveType" value={formData.shortLeaveType || 'Default'} onChange={handleInputChange}>
                                        <option value="Default">Default</option>
                                        <option value="Before Shift">Before Shift</option>
                                        <option value="After Shift">After Shift</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>

                                <div className="form-group-shift">
                                    <label>Short Leave Buffer Minutes</label>
                                    <input
                                        type="number"
                                        name="shortLeaveBufferMinutes"
                                        value={formData.shortLeaveBufferMinutes || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="Enter minutes"
                                    />
                                </div>

                                <div className="form-group-shift">
                                    <label>Short Leave Days</label>
                                    <input
                                        type="text"
                                        name="shortLeaveDays"
                                        value={formData.shortLeaveDays || ''}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Monday, Tuesday"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group-shift">
                            <label>Apply Sandwich Leave</label>
                            <select name="applySandwichLeave" value={formData.applySandwichLeave} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Apply Half Day Before Fix Time Out</label>
                            <select name="applyHalfDayBeforeFixedTimeout" value={formData.applyHalfDayBeforeFixedTimeout} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Apply Leave On Holiday</label>
                            <select name="applyLeaveOnHoliday" value={formData.applyLeaveOnHoliday} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Apply leave on weekoff</label>
                            <select name="applyLeaveOnWeekOff" value={formData.applyLeaveOnWeekOff} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 5 - PENALTY SETTINGS */}
                <div className="shift-card">
                    <h2 className="card-title">Penalty Settings</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>Generate Penalty On Absent</label>
                            <select name="generatePenaltyOnAbsent" value={formData.generatePenaltyOnAbsent} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        {/* Show additional fields when Generate Penalty on Absent is Yes */}
                        {(formData.generatePenaltyOnAbsent === true || formData.generatePenaltyOnAbsent === 'true') && (
                            <>
                                <div className="form-group-shift">
                                    <label>Penalty Type</label>
                                    <select name="penaltyType" value={formData.penaltyType || 'Flat'} onChange={handleInputChange}>
                                        <option value="Flat">Flat</option>
                                        <option value="Percentage">Percentage</option>
                                    </select>
                                </div>

                                <div className="form-group-shift">
                                    <label>Penalty Value <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        name="penaltyValue"
                                        value={formData.penaltyValue || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="Enter penalty value"
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* SECTION 6 - OT SETTINGS */}
                <div className="shift-card">
                    <h2 className="card-title">OT Settings</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>Need Approval For Extra Day <span className="required">*</span></label>
                            <select name="extraDayApprovalPolicy" value={formData.extraDayApprovalPolicy} onChange={handleInputChange}>
                                <option value="None">None</option>
                                <option value="Week Off">Week Off</option>
                                <option value="Holiday">Holiday</option>
                                <option value="Week off and holiday">Week off and holiday</option>
                            </select>
                        </div>

                        {formData.extraDayApprovalPolicy !== 'None' && (
                            <>
                                <div className="form-group-shift">
                                    <label>Need approval for extra hours on weekdays <span className="required">*</span></label>
                                    <select name="needApprovalExtraHoursWeekdays" value={formData.needApprovalExtraHoursWeekdays} onChange={handleInputChange}>
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>
                                    </select>
                                </div>

                                <div className="form-group-shift">
                                    <label>Need OT Request For Same Day <span className="required">*</span></label>
                                    <select name="needOTRequestSameDay" value={formData.needOTRequestSameDay} onChange={handleInputChange}>
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>
                                    </select>
                                </div>

                                <div className="form-group-shift">
                                    <label>OT Request Type <span className="required">*</span></label>
                                    <select name="otRequestType" value={formData.otRequestType} onChange={handleInputChange}>
                                        <option value="Get approval before overtime work">Get approval before overtime work</option>
                                        <option value="Get approval after overtime work">Get approval after overtime work</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="form-group-shift">
                            <label>Shift Time Extra Payout <span className="required">*</span></label>
                            <select name="extraPayoutMultiplier" value={formData.extraPayoutMultiplier} onChange={handleInputChange}>
                                <option value="Default">Default</option>
                                <option value="1x">1x</option>
                                <option value="1.5x">1.5x</option>
                                <option value="2x">2x</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 7 - COMP OFF LEAVE */}
                <div className="shift-card">
                    <h2 className="card-title">Comp Off Leave</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>Add Comp Off Leave On Extra Day <span className="required">*</span></label>
                            <select name="compOffOnExtraDay" value={formData.compOffOnExtraDay} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Add Comp Off Leave On Extra Hours After Shift Hours Completed (Working Days) <span className="required">*</span></label>
                            <select name="compOffOnExtraHoursWorkingDay" value={formData.compOffOnExtraHoursWorkingDay} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        {(formData.compOffOnExtraDay === true || formData.compOffOnExtraDay === 'true' || 
                          formData.compOffOnExtraHoursWorkingDay === true || formData.compOffOnExtraHoursWorkingDay === 'true') && (
                            <>
                                <div className="form-group-shift">
                                    <label>Comp Off Expiry Type <span className="required">*</span></label>
                                    <select name="compOffExpiryType" value={formData.compOffExpiryType} onChange={handleInputChange}>
                                        <option value="None">None</option>
                                        <option value="Custom Days">Custom Days</option>
                                        <option value="End of Month">End of Month</option>
                                        <option value="End of Quarter">End of Quarter</option>
                                        <option value="End of Year">End of Year</option>
                                    </select>
                                </div>

                                {formData.compOffExpiryType === 'Custom Days' && (
                                    <div className="form-group-shift">
                                        <label>Comp Off Leave Expire Days <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            name="compOffExpireDays"
                                            value={formData.compOffExpireDays || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Enter days"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="form-group-shift">
                                    <label>Maximum Comp Off Leave Applicable In A Month <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        name="maxCompOffInMonth"
                                        value={formData.maxCompOffInMonth || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="Enter max limit"
                                        required
                                    />
                                </div>

                                <div className="form-group-shift">
                                    <label>Apply Comp Off Leave On Past Date <span className="required">*</span></label>
                                    <select name="applyCompOffOnPastDate" value={formData.applyCompOffOnPastDate} onChange={handleInputChange}>
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>
                                    </select>
                                </div>

                                <div className="form-group-shift">
                                    <label>Exclude comp off with auto leave <span className="required">*</span></label>
                                    <select name="excludeCompOffWithAutoLeave" value={formData.excludeCompOffWithAutoLeave} onChange={handleInputChange}>
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* SECTION 8 - BREAK SETTINGS */}
                <div className="shift-card">
                    <h2 className="card-title">Break Settings</h2>
                    <div className="form-grid">
                        <div className="form-group-shift">
                            <label>Take Breaks Setting <span className="required">*</span></label>
                            <select name="breakMode" value={formData.breakMode} onChange={handleInputChange}>
                                <option value="Defined Minutes">Defined Minutes</option>
                                <option value="Anytime Between Shift">Anytime Between Shift</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Take Break With Approval In Face App</label>
                            <select name="breakApprovalFaceApp" value={formData.breakApprovalFaceApp} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div className="form-group-shift">
                            <label>Take Break With Approval In Employee App</label>
                            <select name="breakApprovalEmployeeApp" value={formData.breakApprovalEmployeeApp} onChange={handleInputChange}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 9 - WEEKLY SHIFT TIME TABLE */}
                <div className="shift-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2 className="card-title" style={{ marginBottom: 0 }}>Weekly Shift Time Table</h2>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>
                                <input 
                                    type="checkbox" 
                                    name="sameRulesForAllDays" 
                                    checked={formData.sameRulesForAllDays} 
                                    onChange={handleInputChange} 
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#E11D48' }}
                                />
                                Same Rules for All days
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>
                                <input 
                                    type="checkbox" 
                                    name="flexibleShiftHours" 
                                    checked={formData.flexibleShiftHours} 
                                    onChange={handleInputChange} 
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#E11D48' }}
                                />
                                Flexible Shift Hours
                            </label>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table className="shift-schedule-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    {weekDays.map(day => <th key={day}>{day}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="row-label">Shift Start Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.shiftStart || ''}
                                                onChange={(val) => handleScheduleChange(day, 'shiftStart', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Shift End Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.shiftEnd || ''}
                                                onChange={(val) => handleScheduleChange(day, 'shiftEnd', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Lunch Break Start Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.lunchStart || ''}
                                                onChange={(val) => handleScheduleChange(day, 'lunchStart', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Lunch Break End Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.lunchEnd || ''}
                                                onChange={(val) => handleScheduleChange(day, 'lunchEnd', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Tea Break Start Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.teaStart || ''}
                                                onChange={(val) => handleScheduleChange(day, 'teaStart', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Tea Break End Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.teaEnd || ''}
                                                onChange={(val) => handleScheduleChange(day, 'teaEnd', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Three Quarter Day After Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.threeQuarterAfter || ''}
                                                onChange={(val) => handleScheduleChange(day, 'threeQuarterAfter', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Three Quarter Day Before Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.threeQuarterBefore || ''}
                                                onChange={(val) => handleScheduleChange(day, 'threeQuarterBefore', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Half Day After Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.halfDayAfter || ''}
                                                onChange={(val) => handleScheduleChange(day, 'halfDayAfter', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Half Day Before Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.halfDayBefore || ''}
                                                onChange={(val) => handleScheduleChange(day, 'halfDayBefore', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Quarter Day After Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.quarterDayAfter || ''}
                                                onChange={(val) => handleScheduleChange(day, 'quarterDayAfter', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Quarter Day Before Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.quarterDayBefore || ''}
                                                onChange={(val) => handleScheduleChange(day, 'quarterDayBefore', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Late In Count After Minutes</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <input
                                                type="number"
                                                value={formData.schedule[day]?.lateCountAfter || ''}
                                                onChange={(e) => handleScheduleChange(day, 'lateCountAfter', e.target.value)}
                                                min="0"
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Early Out Count Before Minutes</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <input
                                                type="number"
                                                value={formData.schedule[day]?.earlyCountBefore || ''}
                                                onChange={(e) => handleScheduleChange(day, 'earlyCountBefore', e.target.value)}
                                                min="0"
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Minimum Quarter Day Hours</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <HourMinutePicker
                                                value={formData.schedule[day]?.minQuarterHours || ''}
                                                onChange={(val) => handleScheduleChange(day, 'minQuarterHours', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Minimum Half Day Hours</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <HourMinutePicker
                                                value={formData.schedule[day]?.minHalfHours || ''}
                                                onChange={(val) => handleScheduleChange(day, 'minHalfHours', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Minimum Three Quarter Day Hours</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <HourMinutePicker
                                                value={formData.schedule[day]?.minThreeQuarterHours || ''}
                                                onChange={(val) => handleScheduleChange(day, 'minThreeQuarterHours', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Minimum Full Day Hours</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <HourMinutePicker
                                                value={formData.schedule[day]?.minFullDayHours || ''}
                                                onChange={(val) => handleScheduleChange(day, 'minFullDayHours', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Maximum Personal Break</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <input
                                                type="number"
                                                value={formData.schedule[day]?.maxPersonalBreak || ''}
                                                onChange={(e) => handleScheduleChange(day, 'maxPersonalBreak', e.target.value)}
                                                min="0"
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Maximum Punch Out Time</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <ShiftTimePicker
                                                value={formData.schedule[day]?.maxPunchOutTime || ''}
                                                onChange={(val) => handleScheduleChange(day, 'maxPunchOutTime', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-label">Maximum Punch Out Hour</td>
                                    {days.map(day => (
                                        <td key={day}>
                                            <HourDurationSelect
                                                value={formData.schedule[day]?.maxPunchOutHour || ''}
                                                onChange={(val) => handleScheduleChange(day, 'maxPunchOutHour', val)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="form-actions">
                    <button type="submit" className="btn-theme btn-theme-primary">
                        <Check size={18} /> ADD
                    </button>
                    <button type="button" className="btn-theme btn-theme-secondary" onClick={handleReset}>
                        <RotateCcw size={18} /> RESET
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddShift;
