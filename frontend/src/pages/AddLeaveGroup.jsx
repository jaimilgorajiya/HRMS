import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, RotateCcw, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import SearchableSelect from '../components/SearchableSelect';
import authenticatedFetch from '../utils/apiHandler';
import API_URL from '../config/api';

const initialFormData = {
    leaveGroupName: '',
    leaveBalanceVisibility: 'Default (Multiple of 0.5)',
    leaveIntimationEmails: '',
    generatePenaltyOnLeaveRequestPending: 'No',
    isPaidLeave: false,
    leaveAllocationType: 'Yearly',
    noOfPaidLeaves: '',
    leaveAppliedFormula: 'Multiple of 0.5',
    maxUseInMonth: '',
    leaveFrequency: 'Annually',
    leaveCalculation: 'Manual Calculation',
    leaveRestrictions: 'No',
    leaveAccordingToPayrollCycle: 'No',
    takeLeaveDuringProbationPeriod: 'No',
    takeLeaveDuringNoticePeriod: 'No',
    addPaidLeaveBasedOnAttendance: 'No',
    restrictUnpaidLeaveToEmployeesMonthly: 'No',
    remark: '',
    yearEndLeaveBalancePolicy: 'Payout all (Manually)',
    allowLeavePayoutRequest: 'No',
};

const AddLeaveGroup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSelect = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                leaveIntimationEmails: formData.leaveIntimationEmails
                    ? formData.leaveIntimationEmails.split(',').map(s => s.trim()).filter(Boolean)
                    : [],
                noOfPaidLeaves: formData.noOfPaidLeaves !== '' ? Number(formData.noOfPaidLeaves) : 0,
                maxUseInMonth: formData.maxUseInMonth !== '' ? Number(formData.maxUseInMonth) : null,
            };
            const res = await authenticatedFetch(`${API_URL}/api/leave-groups`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                Swal.fire({ title: 'Success!', text: 'Leave Group created successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
                navigate('/admin/leave/group');
            } else {
                Swal.fire('Error', data.message || 'Failed to create leave group', 'error');
            }
        } catch {
            Swal.fire('Error', 'Failed to create leave group', 'error');
        }
    };

    const handleReset = () => setFormData(initialFormData);

    return (
        <div className="hrm-container">
            <div className="hrm-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="icon-btn" onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="hrm-title">Add Leave Group</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="hrm-card" style={{ padding: '30px' }}>
                    {/* Section: General Settings */}
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 24px 0', paddingBottom: '12px', borderBottom: '2px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        General Settings
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        <div className="hrm-form-group">
                            <label className="hrm-label">Leave Group Name <span className="req">*</span></label>
                            <input type="text" name="leaveGroupName" className="hrm-input" value={formData.leaveGroupName} onChange={handleChange} placeholder="Enter leave group name" required />
                        </div>
                        <div className="hrm-form-group">
                            <SearchableSelect
                                label="Leave Balance Visibility"
                                options={[
                                    { label: 'Default (Multiple of 0.5)', value: 'Default (Multiple of 0.5)' },
                                    { label: 'Multiple of 1', value: 'Multiple of 1' },
                                    { label: 'Multiple of 0.25', value: 'Multiple of 0.25' },
                                ]}
                                value={formData.leaveBalanceVisibility}
                                onChange={(val) => handleSelect('leaveBalanceVisibility', val)}
                            />
                        </div>
                        <div className="hrm-form-group">
                            <label className="hrm-label">Leave Intimation Emails</label>
                            <input type="text" name="leaveIntimationEmails" className="hrm-input" value={formData.leaveIntimationEmails} onChange={handleChange} placeholder="Enter email IDs (comma separated)" />
                        </div>
                        <div className="hrm-form-group">
                            <SearchableSelect
                                label="Generate Penalty on Leave Request Pending"
                                required={true}
                                options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]}
                                value={formData.generatePenaltyOnLeaveRequestPending}
                                onChange={(val) => handleSelect('generatePenaltyOnLeaveRequestPending', val)}
                            />
                        </div>

                        {/* Paid Leave Checkbox */}
                        <div className="hrm-form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '30px' }}>
                            <input
                                type="checkbox"
                                id="isPaidLeave"
                                name="isPaidLeave"
                                checked={formData.isPaidLeave}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#3B648B' }}
                            />
                            <label htmlFor="isPaidLeave" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 600, fontSize: '14px', color: '#475569' }}>Paid Leave</label>
                        </div>
                    </div>

                    {/* Paid Leave Expanded Fields */}
                    {formData.isPaidLeave && (
                        <>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '32px 0 24px 0', paddingBottom: '12px', borderBottom: '2px solid #F1F5F9' }}>
                                Paid Leave Configuration
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Leave Allocation Type" options={[
                                        { label: 'Yearly', value: 'Yearly' }, { label: 'Monthly', value: 'Monthly' },
                                        { label: 'Quarterly', value: 'Quarterly' }, { label: 'Half Yearly', value: 'Half Yearly' },
                                    ]} value={formData.leaveAllocationType} onChange={(val) => handleSelect('leaveAllocationType', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <label className="hrm-label">No of Paid Leaves</label>
                                    <input type="number" name="noOfPaidLeaves" className="hrm-input" value={formData.noOfPaidLeaves} onChange={handleChange} placeholder="Enter leave count" min="0" />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Leave Applied Formula" options={[
                                        { label: 'Multiple of 0.5', value: 'Multiple of 0.5' }, { label: 'Multiple of 1', value: 'Multiple of 1' },
                                        { label: 'Multiple of 0.25', value: 'Multiple of 0.25' },
                                    ]} value={formData.leaveAppliedFormula} onChange={(val) => handleSelect('leaveAppliedFormula', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <label className="hrm-label">Max Use in Month</label>
                                    <input type="number" name="maxUseInMonth" className="hrm-input" value={formData.maxUseInMonth} onChange={handleChange} placeholder="Enter max usage" min="0" />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Leave Frequency" options={[
                                        { label: 'Annually', value: 'Annually' }, { label: 'Monthly', value: 'Monthly' }, { label: 'Quarterly', value: 'Quarterly' },
                                    ]} value={formData.leaveFrequency} onChange={(val) => handleSelect('leaveFrequency', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Leave Calculation" options={[
                                        { label: 'Manual Calculation', value: 'Manual Calculation' }, { label: 'Auto Calculation', value: 'Auto Calculation' },
                                    ]} value={formData.leaveCalculation} onChange={(val) => handleSelect('leaveCalculation', val)} />
                                </div>
                            </div>

                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '32px 0 24px 0', paddingBottom: '12px', borderBottom: '2px solid #F1F5F9' }}>
                                Leave Policies
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Leave Restrictions" options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={formData.leaveRestrictions} onChange={(val) => handleSelect('leaveRestrictions', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Leave According to Payroll Cycle" required={true} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={formData.leaveAccordingToPayrollCycle} onChange={(val) => handleSelect('leaveAccordingToPayrollCycle', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Take Leave During Probation Period" required={true} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={formData.takeLeaveDuringProbationPeriod} onChange={(val) => handleSelect('takeLeaveDuringProbationPeriod', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Take Leave During Notice Period" required={true} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={formData.takeLeaveDuringNoticePeriod} onChange={(val) => handleSelect('takeLeaveDuringNoticePeriod', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Add Paid Leave Based on Attendance" required={true} options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={formData.addPaidLeaveBasedOnAttendance} onChange={(val) => handleSelect('addPaidLeaveBasedOnAttendance', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Restrict Unpaid Leave Monthly" options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={formData.restrictUnpaidLeaveToEmployeesMonthly} onChange={(val) => handleSelect('restrictUnpaidLeaveToEmployeesMonthly', val)} />
                                </div>
                            </div>

                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '32px 0 24px 0', paddingBottom: '12px', borderBottom: '2px solid #F1F5F9' }}>
                                Year-End & Payout
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                <div className="hrm-form-group">
                                    <label className="hrm-label">Remark</label>
                                    <textarea name="remark" className="hrm-input" value={formData.remark} onChange={handleChange} placeholder="Enter remark" rows={3} style={{ resize: 'vertical', minHeight: '48px' }} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Year-End Leave Balance Policy" options={[
                                        { label: 'Payout all (Manually)', value: 'Payout all (Manually)' }, { label: 'Carry Forward', value: 'Carry Forward' },
                                        { label: 'Lapse', value: 'Lapse' }, { label: 'Payout all (Auto)', value: 'Payout all (Auto)' },
                                    ]} value={formData.yearEndLeaveBalancePolicy} onChange={(val) => handleSelect('yearEndLeaveBalancePolicy', val)} />
                                </div>
                                <div className="hrm-form-group">
                                    <SearchableSelect label="Allow Leave Payout Request" options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} value={formData.allowLeavePayoutRequest} onChange={(val) => handleSelect('allowLeavePayoutRequest', val)} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F1F5F9' }}>
                        <button type="button" className="btn-hrm btn-hrm-secondary" onClick={handleReset}>
                            <RotateCcw size={16} /> Reset
                        </button>
                        <button type="submit" className="btn-hrm btn-hrm-primary">
                            <Check size={16} /> Add Leave Group
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddLeaveGroup;
