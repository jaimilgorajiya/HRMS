import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Mail, Phone, MapPin, Building2, Briefcase, 
    Calendar, User, ShieldCheck, Clock, Award, FileText,
    Check, X, Camera
} from 'lucide-react';
import authenticatedFetch from '../utils/apiHandler';
import API_URL from '../config/api';
import Swal from 'sweetalert2';
import SearchableSelect from '../components/SearchableSelect';

const EmployeeProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Dropdown data
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [countries, setCountries] = useState([]);

    const [formData, setFormData] = useState({});
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchEmployeeDetails();
        fetchDropdownData();
        fetchCountryCodes();
    }, [id]);

    const fetchEmployeeDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await authenticatedFetch(`${API_URL}/api/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEmployee(data.user);
                setFormData(data.user);
            } else {
                Swal.fire('Error', data.message || 'Failed to fetch employee details', 'error');
                navigate('/admin/employees/list');
            }
        } catch (error) {
            console.error("Error fetching employee details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        const token = localStorage.getItem('token');
        try {
            const [branchRes, deptRes, desigRes, shiftRes] = await Promise.all([
                authenticatedFetch(`${API_URL}/api/branches`, { headers: { 'Authorization': `Bearer ${token}` } }),
                authenticatedFetch(`${API_URL}/api/departments`, { headers: { 'Authorization': `Bearer ${token}` } }),
                authenticatedFetch(`${API_URL}/api/designations`, { headers: { 'Authorization': `Bearer ${token}` } }),
                authenticatedFetch(`${API_URL}/api/shifts`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const bData = await branchRes.json();
            const dData = await deptRes.json();
            const deData = await desigRes.json();
            const sData = await shiftRes.json();

            if (bData.success) setBranches(bData.branches);
            if (dData.success) setDepartments(dData.departments);
            if (deData.success) setDesignations(deData.designations);
            if (sData.success) setShifts(sData.shifts);
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        }
    };

    const fetchCountryCodes = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2');
            const data = await response.json();
            
            const countryList = data.map(country => {
                const root = country.idd.root || '';
                const suffix = country.idd.suffixes ? country.idd.suffixes[0] : '';
                return {
                    name: country.name.common,
                    code: `${root}${suffix}`,
                    cca2: country.cca2
                };
            }).filter(c => c.code)
            .sort((a, b) => a.name.localeCompare(b.name));

            // Move India to top
            const indiaIndex = countryList.findIndex(c => c.cca2 === 'IN');
            if (indiaIndex > -1) {
                const india = countryList.splice(indiaIndex, 1)[0];
                countryList.unshift(india);
            }

            setCountries(countryList);
        } catch (error) {
            console.error("Error fetching country codes:", error);
            setCountries([
                { name: 'India', code: '+91', cca2: 'IN' },
                { name: 'USA', code: '+1', cca2: 'US' }
            ]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Mobile number validation: only allow digits and enforce length by country
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, ''); 
            const code = formData.countryCode || '+91';
            
            // Length definitions
            const lengths = {
                '+91': 10, // India
                '+1': 10,  // USA/Canada
                '+44': 10, // UK
                '+61': 9,  // Australia
            };
            
            const maxLen = lengths[code] || 15;
            
            if (numericValue.length <= maxLen) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            
            // Use FormData for file upload support
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                // Handle nested objects or dates if necessary, but here we just append top level
                if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });

            if (profilePhoto) {
                data.append('profilePhoto', profilePhoto);
            }

            const response = await fetch(`${API_URL}/api/users/${id}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`
                    // Note: Browser sets Content-Type boundary for FormData
                },
                body: data
            });
            
            const resData = await response.json();
            if (resData.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Profile updated successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                setEmployee(resData.user);
                setFormData(resData.user);
                setProfilePhoto(null);
            } else {
                Swal.fire('Error', resData.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error("Save error:", error);
            Swal.fire('Error', 'An error occurred while saving', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-container">Loading Profile...</div>;
    if (!employee) return <div className="loading-container">Employee not found.</div>;

    return (
        <div className="hrm-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="icon-btn" onClick={() => navigate('/admin/employees/list')} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                        <ArrowLeft size={20} color="#64748b" />
                    </button>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Employee Profile</h1>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
                {/* Profile Card & Basic Info */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '40px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 0 0 1px #e2e8f0' }}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : formData.profilePhoto ? (
                                    <img src={`${API_URL}/${formData.profilePhoto}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#3B648B' }}>
                                        {formData.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <label style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                right: 0, 
                                background: '#3B648B', 
                                border: '2px solid #fff', 
                                borderRadius: '50%', 
                                width: '30px', 
                                height: '30px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer' 
                            }}>
                                <Camera size={14} color="white" />
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                        <div>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', border: 'none', borderBottom: '2px solid transparent', padding: '2px 5px', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#3B648B'}
                                onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
                            />
                            <p style={{ color: '#64748b', margin: '5px 0 0 5px', fontWeight: '500' }}>{formData.employeeId || 'EMP-000'}</p>
                        </div>
                    </div>

                    {/* Standard Grid Layout from Screenshot */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        
                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Designation"
                                required={true}
                                searchable={true}
                                options={designations.map(d => ({ value: d.designationName, label: d.designationName }))}
                                value={formData.designation}
                                onChange={(val) => setFormData(prev => ({ ...prev, designation: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Employment Type"
                                options={[
                                    { value: 'Full Time', label: 'Full Time' },
                                    { value: 'Part Time', label: 'Part Time' },
                                    { value: 'Contract', label: 'Contract' },
                                    { value: 'Intern', label: 'Intern' }
                                ]}
                                value={formData.employmentType}
                                onChange={(val) => setFormData(prev => ({ ...prev, employmentType: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <label className="ss-label">Employee ID</label>
                            <input type="text" name="employeeId" value={formData.employeeId || ''} onChange={handleInputChange} className="ss-input" />
                        </div>

                        <div className="ss-form-group">
                            <label className="ss-label">Date Of Joining <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="date" name="dateOfJoining" value={formData.dateOfJoining ? formData.dateOfJoining.split('T')[0] : ''} onChange={handleInputChange} className="ss-input" />
                        </div>

                        <div className="ss-form-group">
                            <label className="ss-label">Probation Period Days</label>
                            <input type="number" name="probationPeriodDays" value={formData.probationPeriodDays || ''} onChange={handleInputChange} className="ss-input" placeholder="Enter days" />
                        </div>

                        <div className="ss-form-group">
                            <label className="ss-label">Training Completion Date</label>
                            <input type="date" name="trainingCompletionDate" value={formData.trainingCompletionDate ? formData.trainingCompletionDate.split('T')[0] : ''} onChange={handleInputChange} className="ss-input" />
                        </div>

                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Branch"
                                searchable={true}
                                options={branches.map(b => ({ value: b.branchName, label: b.branchName }))}
                                value={formData.branch}
                                onChange={(val) => setFormData(prev => ({ ...prev, branch: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Department"
                                searchable={true}
                                options={departments.map(d => ({ value: d.name, label: d.name }))}
                                value={formData.department}
                                onChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Shift Timing"
                                searchable={true}
                                options={shifts.map(s => ({ value: s.shiftName, label: s.shiftName }))}
                                value={formData.shift}
                                onChange={(val) => setFormData(prev => ({ ...prev, shift: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Status"
                                options={[
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Inactive', label: 'Inactive' },
                                    { value: 'Onboarding', label: 'Onboarding' },
                                    { value: 'Resigned', label: 'Resigned' }
                                ]}
                                value={formData.status}
                                onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <label className="ss-label">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email || ''} 
                                readOnly 
                                disabled
                                className="ss-input disabled-input" 
                                style={{ background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Country Code"
                                required={true}
                                searchable={true}
                                options={countries.map(c => ({ 
                                    value: c.code, 
                                    label: `${c.name} (${c.code})` 
                                }))}
                                value={formData.countryCode || '+91'}
                                onChange={(val) => setFormData(prev => ({ ...prev, countryCode: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <label className="ss-label">Mobile Number</label>
                            <input 
                                type="text" 
                                name="phone" 
                                value={formData.phone || ''} 
                                onChange={handleInputChange} 
                                className="ss-input" 
                                placeholder="Enter mobile number"
                            />
                        </div>

                        <div className="ss-form-group">
                            <SearchableSelect 
                                label="Gender"
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                                value={formData.gender}
                                onChange={(val) => setFormData(prev => ({ ...prev, gender: val }))}
                            />
                        </div>

                        <div className="ss-form-group">
                            <label className="ss-label">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''} onChange={handleInputChange} className="ss-input" />
                        </div>
                    </div>
                </div>

                {/* Bottom Save Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                        onClick={handleUpdate}
                        disabled={saving}
                        style={{ 
                            background: '#3B648B', 
                            color: 'white', 
                            border: 'none', 
                            padding: '12px 36px', 
                            borderRadius: '10px', 
                            fontWeight: '700', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(59, 100, 139, 0.25)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {saving ? 'Saving...' : <><Check size={20} /> SAVE CHANGES</>}
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .ss-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .ss-label {
                    font-size: 14.5px;
                    font-weight: 600;
                    color: #475569;
                }
                .ss-input {
                    height: 45px;
                    padding: 0 16px;
                    border: 1.5px solid #E2E8F0;
                    border-radius: 10px;
                    font-size: 15px;
                    color: #1e293b;
                    background: #fff;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    outline: none;
                }
                .ss-input:focus {
                    border-color: #3B648B;
                    box-shadow: 0 0 0 4px rgba(59, 100, 139, 0.1);
                }
            `}} />
        </div>
    );
};

export default EmployeeProfile;
