import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { 
  User, Check, ChevronRight, Upload, Briefcase, Shield, FileText, ArrowLeft
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

// Interfaces matching backend User Model structure
interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

interface WorkSetup {
  location: string;
  mode: 'Office' | 'Hybrid' | 'Remote';
  shift: string;
}

interface SalaryDetails {
  salaryType: 'Monthly' | 'Hourly' | 'Contract';
  baseSalary: number;
  payGrade: string;
  effectiveFrom: string;
  ctc: number;
}

interface UserDocuments {
  resume: string;
  idProof: string;
  photograph: string;
  offerLetter: string;
  appointmentLetter: string;
  nda: string;
  bankPassbook: string;
  panCard: string;
}

interface Verification {
  status: 'Pending' | 'Verified';
  verifiedBy: string;
  verificationDate: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address: Address;
  emergencyContact: EmergencyContact;
  
  employeeId: string;
  department: string;
  position: string;
  designation: string;
  dateJoined: string;
  employmentType: string;
  reportingTo: string;
  workSetup: WorkSetup;
  salaryDetails: SalaryDetails;

  role: 'Admin' | 'Manager' | 'Employee';
  status: 'Active' | 'Inactive' | 'Onboarding';
  permissions: {
    moduleAccess: string[];
    approvalRights: boolean;
  };
  forcePasswordReset: boolean;
  inviteSent: boolean;

  documents: UserDocuments;
  verification: Verification;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'Prefer not to say',
  address: { street: '', city: '', state: '', country: '', pincode: '' },
  emergencyContact: { name: '', relation: '', phone: '' },
  
  employeeId: '',
  department: '',
  position: '',
  designation: '',
  dateJoined: '',
  employmentType: '',
  reportingTo: '',
  workSetup: { location: '', mode: 'Office', shift: '' },
  salaryDetails: { salaryType: 'Monthly', baseSalary: 0, payGrade: '', effectiveFrom: '', ctc: 0 },

  role: 'Employee',
  status: 'Active',
  permissions: { moduleAccess: [], approvalRights: false },
  forcePasswordReset: true,
  inviteSent: false,

  documents: {
    resume: '', idProof: '', photograph: '', offerLetter: 
    '', appointmentLetter: '', nda: '', bankPassbook: '', panCard: ''
  },
  verification: { status: 'Pending', verifiedBy: '', verificationDate: '' }
};

export default function UserForm({ userId: propUserId, onClose, isModal = false }: { userId?: string, onClose?: () => void, isModal?: boolean }) {
  const { id: paramId } = useParams();
  const id = propUserId || paramId;
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch meta data (departments, designations, locations)
        const [deptRes, desigRes, locRes] = await Promise.all([
           axios.get(`${import.meta.env.VITE_API_URL}/departments`, { headers }),
           axios.get(`${import.meta.env.VITE_API_URL}/designations`, { headers }),
           axios.get(`${import.meta.env.VITE_API_URL}/locations`, { headers })
        ]);
        
        if (deptRes.data.success) setDepartments(deptRes.data.departments);
        if (desigRes.data.success) setDesignations(desigRes.data.designations);
        if (locRes.data.success) setLocations(locRes.data.locations);

        // Fetch User Data if Edit Mode
        if (isEditMode) {
          const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`, { headers });
          if (userRes.data.success) {
             const userData = userRes.data.user;
             // Date formatting for inputs (YYYY-MM-DD)
             const formatDate = (dateString?: string) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';
             
             setFormData({
               ...initialFormData, // fallback for missing fields
               ...userData,
               dateOfBirth: formatDate(userData.dateOfBirth),
               dateJoined: formatDate(userData.dateJoined),
               verification: {
                 ...userData.verification,
                 verificationDate: formatDate(userData.verification?.verificationDate)
               },
               // Ensure nested objects exist to avoid undefined errors
               address: userData.address || initialFormData.address,
               emergencyContact: userData.emergencyContact || initialFormData.emergencyContact,
               workSetup: userData.workSetup || initialFormData.workSetup,
               salaryDetails: userData.salaryDetails || initialFormData.salaryDetails,
               permissions: userData.permissions || initialFormData.permissions,
               documents: userData.documents || initialFormData.documents,
             });
          }
        } else {
             // Fetch Next Employee ID for new user
             const nextIdRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/next-id`, { headers });
             if (nextIdRes.data.success) {
                 setFormData(prev => ({ ...prev, employeeId: nextIdRes.data.nextId }));
             }
        }

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
        const newData = { ...prev };
        const keys = field.split('.');
        if (keys.length === 1) {
            (newData as any)[keys[0]] = value;
        } else if (keys.length === 2) {
            (newData as any)[keys[0]][keys[1]] = value;
        }
        return newData;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: keyof UserDocuments) => {
     if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         const formDataVerify = new globalThis.FormData(); 
         formDataVerify.append('file', file);

         try {
             const token = localStorage.getItem('token');
             const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formDataVerify, {
                 headers: { 
                     Authorization: `Bearer ${token}`,
                     'Content-Type': 'multipart/form-data'
                 }
             });
             
             if (res.data.success) {
                 handleInputChange(`documents.${docType}`, res.data.fileUrl);
             }
         } catch (error) {
             console.error("Upload failed", error);
             alert("File upload failed");
         }
     }
  };

  const validateStep = (step: number) => {
      if (step === 1) {
          if (!formData.firstName || !formData.lastName || !formData.email) {
              alert("Please fill in required fields: First Name, Last Name, Email");
              return false;
          }
      }
      return true;
  };

  const handleNext = () => {
      if (validateStep(activeStep)) {
          setActiveStep(prev => Math.min(prev + 1, 4));
      }
  };

  const handleBack = () => {
      setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
      if (!validateStep(4)) return;
      setLoading(true);
      try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: `Bearer ${token}` };
          
          if (isEditMode) {
              await axios.put(`${import.meta.env.VITE_API_URL}/users/${id}`, formData, { headers });
          } else {
              await axios.post(`${import.meta.env.VITE_API_URL}/users/create`, formData, { headers });
          }
          alert(`User ${isEditMode ? 'updated' : 'created'} successfully!`);
          if (onClose) {
              onClose();
          } else {
              navigate('/employees');
          }
      } catch (error: any) {
          console.error("Submit error", error);
          alert(error.response?.data?.message || "Operation failed");
      } finally {
          setLoading(false);
      }
  };

  const steps = [
      { id: 1, title: 'Personal Info', icon: User },
      { id: 2, title: 'Job Details', icon: Briefcase },
      { id: 3, title: 'Access & Role', icon: Shield },
      { id: 4, title: 'Documents', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {!isModal && (
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" className="p-2" onClick={() => navigate('/employees')}>
            <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
            <p className="text-sm text-gray-500">Manage employee details</p>
            </div>
        </div>
      )}

      {/* Stepper */}
      <Card className="mb-6">
          <div className="p-6">
              <div className="flex items-center justify-between relative">
                  {/* Progress Bar Background */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-1" />
                  
                  {/* Active Progress Bar */}
                  <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-1"
                    style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                  />

                  {steps.map((step) => {
                      const isActive = activeStep >= step.id;
                      const isCurrent = activeStep === step.id;
                      return (
                          <div key={step.id} className="flex flex-col items-center bg-white px-2 z-10">
                              <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                    isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                                }`}
                              >
                                  {isActive ? <Check className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                              </div>
                              <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                                  {step.title}
                              </span>
                          </div>
                      );
                  })}
              </div>
          </div>
      </Card>

      <Card className="p-6">
          {/* Step 1: Personal Info */}
          {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Fields marked with * are required</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="First Name *" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required />
                      <Input label="Last Name *" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required />
                      
                      <Input label="Work Email *" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                      <Input label="Phone Number" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                        <input 
                            type="date" 
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={formData.dateOfBirth} 
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} 
                        />
                      </div>
                      
                      <Select 
                          label="Gender" 
                          options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}, {value: 'Prefer not to say', label: 'Prefer not to say'}]}
                          value={formData.gender}
                          onChange={(value) => handleInputChange('gender', value)}
                      />
                  </div>

                  <div className="border-t pt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Address Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Street Address" value={formData.address.street} onChange={(e) => handleInputChange('address.street', e.target.value)} />
                          <Input label="City" value={formData.address.city} onChange={(e) => handleInputChange('address.city', e.target.value)} />
                          <Input label="State" value={formData.address.state} onChange={(e) => handleInputChange('address.state', e.target.value)} />
                          <Input label="Country" value={formData.address.country} onChange={(e) => handleInputChange('address.country', e.target.value)} />
                          <Input label="Pincode" value={formData.address.pincode} onChange={(e) => handleInputChange('address.pincode', e.target.value)} />
                      </div>
                  </div>

                   <div className="border-t pt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Emergency Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Contact Name" value={formData.emergencyContact.name} onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)} />
                          <Input label="Relation" value={formData.emergencyContact.relation} onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)} />
                          <Input label="Phone Number" value={formData.emergencyContact.phone} onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)} />
                      </div>
                  </div>
              </div>
          )}

          {/* Step 2: Job Details */}
          {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <Input label="Employee ID" value={formData.employeeId} disabled={!isEditMode && !!formData.employeeId} onChange={(e) => handleInputChange('employeeId', e.target.value)} />
                      
                      <Select
                             label="Department"
                             options={[
                                { value: '', label: 'Select Department' },
                                ...departments.map(d => ({ value: d.name, label: d.name }))
                             ]}
                             value={formData.department}
                             onChange={(value) => {
                                 handleInputChange('department', value);
                                 handleInputChange('position', ''); // Reset designation when department changes
                             }}
                        />

                      <Select
                             label="Designation / Position"
                             options={[
                                { value: '', label: 'Select Designation' },
                                ...designations
                                    .filter(d => d.department === formData.department)
                                    .map(d => ({ value: d.name, label: d.name }))
                             ]}
                             value={formData.position}
                             onChange={(value) => handleInputChange('position', value)}
                             disabled={!formData.department}
                        />

                      <Input label="Reporting Manager" value={formData.reportingTo} onChange={(e) => handleInputChange('reportingTo', e.target.value)} />

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Joining Date</label>
                        <input 
                            type="date" 
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={formData.dateJoined} 
                            onChange={(e) => handleInputChange('dateJoined', e.target.value)} 
                        />
                      </div>

                      <Select 
                          label="Employment Type"
                          options={[{value: 'Full Time', label: 'Full Time'}, {value: 'Part Time', label: 'Part Time'}, {value: 'Contract', label: 'Contract'}, {value: 'Internship', label: 'Internship'}]}
                          value={formData.employmentType}
                          onChange={(value) => handleInputChange('employmentType', value)}
                      />
                  </div>

                  <div className="border-t pt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Work Setup</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select 
                                label="Location / Branch"
                                options={[
                                    { value: '', label: 'Select Location' },
                                    ...locations.map(l => ({ value: l.name, label: l.name }))
                                ]}
                                value={formData.workSetup.location}
                                onChange={(value) => handleInputChange('workSetup.location', value)}
                            />
                            <Select 
                                label="Work Mode"
                                options={[{value: 'Office', label: 'Office'}, {value: 'Hybrid', label: 'Hybrid'}, {value: 'Remote', label: 'Remote'}]}
                                value={formData.workSetup.mode}
                                onChange={(value) => handleInputChange('workSetup.mode', value)}
                            />
                            <Input label="Shift" placeholder="e.g. 9:00 AM - 6:00 PM" value={formData.workSetup.shift} onChange={(e) => handleInputChange('workSetup.shift', e.target.value)} />
                      </div>
                  </div>

                  <div className="border-t pt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Salary Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Input label="Base Salary" type="number" value={formData.salaryDetails.baseSalary} onChange={(e) => handleInputChange('salaryDetails.baseSalary', Number(e.target.value))} />
                           <Input label="Pay Grade / Level" value={formData.salaryDetails.payGrade} onChange={(e) => handleInputChange('salaryDetails.payGrade', e.target.value)} />
                      </div>
                  </div>
              </div>
          )}

          {/* Step 3: Access & Role */}
          {activeStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Select 
                            label="System Role *"
                            options={[{value: 'Employee', label: 'Employee'}, {value: 'Manager', label: 'Manager'}]}
                            value={formData.role}
                            onChange={(value) => handleInputChange('role', value)}
                        />
                         <Select 
                            label="Employee Status"
                            options={[{value: 'Active', label: 'Active'}, {value: 'Inactive', label: 'Inactive'}]}
                            value={formData.status}
                            onChange={(value) => handleInputChange('status', value)}
                        />
                   </div>

                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                       <h4 className="text-sm font-semibold text-blue-800 mb-2">Login Credentials</h4>
                       <div className="text-sm text-blue-700 space-y-1">
                           <p>• Auto-Generated Credentials</p>
                           <p>• A secure random password will be automatically generated</p>
                           <p>• Employee ID and password will be sent to: <strong>{formData.email || 'Email not provided'}</strong></p>
                           <p>• User will be required to change password on first login</p>
                       </div>
                   </div>

          
              </div>
          )}

          {/* Step 4: Documents */}
          {activeStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="bg-blue-50 p-4 rounded-lg text-center">
                       <h3 className="text-blue-800 font-medium">Documents Upload</h3>
                       <p className="text-sm text-blue-600">Upload employee documents for verification and compliance</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {Object.keys(formData.documents).map((key) => (
                           <div key={key} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                               <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                               <div className="flex items-center gap-2">
                                   {(formData.documents as any)[key] && (
                                       <a href={(formData.documents as any)[key]} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs hover:underline mr-2">
                                           View
                                       </a>
                                   )}
                                   <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm flex items-center gap-1 transition-all">
                                       <Upload className="w-3 h-3" />
                                       Upload
                                       <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, key as keyof UserDocuments)} />
                                   </label>
                               </div>
                           </div>
                       ))}
                   </div>

                   <div className="border-t pt-4">
                       <h4 className="text-md font-medium text-gray-700 mb-4">Compliance Verification</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Select 
                                label="Document Verified"
                                options={[{value: 'Pending', label: 'Pending'}, {value: 'Verified', label: 'Verified'}]}
                                value={formData.verification.status}
                                onChange={(value) => handleInputChange('verification.status', value)}
                           />
                           <Input 
                                label="Verified By (Admin)" 
                                value={formData.verification.verifiedBy} 
                                onChange={(e) => handleInputChange('verification.verifiedBy', e.target.value)} 
                           />
                           <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Verification Date</label>
                                <input 
                                    type="date" 
                                    className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    value={formData.verification.verificationDate} 
                                    onChange={(e) => handleInputChange('verification.verificationDate', e.target.value)} 
                                />
                           </div>
                       </div>
                   </div>
              </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
               <Button variant="secondary" onClick={onClose || (activeStep === 1 ? () => navigate('/employees') : handleBack)}>
                   {activeStep === 1 ? 'Cancel' : 'Back'}
               </Button>
               
               <Button onClick={activeStep === 4 ? handleSubmit : handleNext} disabled={loading}>
                   {loading ? 'Processing...' : (activeStep === 4 ? (isEditMode ? 'Save Changes' : 'Create Employee') : 'Next Step')}
                   {!loading && activeStep !== 4 && <ChevronRight className="w-4 h-4 ml-1" />}
               </Button>
          </div>
      </Card>
    </div>
  );
}
