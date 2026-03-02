import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
// CSS moved to index.css

const MyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyContact: '',
    companyEmail: '',
    logo: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  const fileInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/company`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.ok) {
          const data = await response.json();
          setCompanyData(data);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [apiUrl]);

  const getFullLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${apiUrl}${logoPath}`;
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (passwords.currentPassword === passwords.newPassword) {
      return Swal.fire({
          title: 'Error',
          text: 'New password cannot be the same as the current password.',
          icon: 'error',
          confirmButtonColor: '#111827',
      });
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      return Swal.fire({
          title: 'Error',
          text: 'New passwords do not match.',
          icon: 'error',
          confirmButtonColor: '#111827',
      });
    }

    if (passwords.newPassword.length < 6) {
      return Swal.fire({
          title: 'Error',
          text: 'New password must be at least 6 characters long.',
          icon: 'error',
          confirmButtonColor: '#111827',
      });
    }

    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been changed successfully.',
          icon: 'success',
          confirmButtonColor: '#111827',
          timer: 2000,
          showConfirmButton: false
        });
        setPasswords({currentPassword: '', newPassword: '', confirmPassword: ''});
      } else {
        Swal.fire({
            title: 'Error',
            text: data.message || 'Failed to change password.',
            icon: 'error',
            confirmButtonColor: '#111827',
        });
      }
    } catch (error) {
       console.error("Change Password Error:", error);
       Swal.fire({
            title: 'Error',
            text: 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonColor: '#111827',
        });
    } finally {
        setIsChangingPassword(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      Swal.fire({
        title: 'Upload Photo?',
        text: `Do you want to set ${file.name} as your profile photo?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#111827',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Uploading...',
                text: 'Please wait while we update your profile photo.',
                allowOutsideClick: false,
                didOpen: () => {
                   Swal.showLoading();
                }
            });

            try {
              const uploadDataForm = new FormData();
              uploadDataForm.append('file', file);
              
              const token = localStorage.getItem('token');
              const uploadRes = await fetch(`${apiUrl}/api/upload`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                body: uploadDataForm
              });
              
              const uploadData = await uploadRes.json();
              if (uploadData.success) {
                  const newLogoUrl = uploadData.fileUrl;
                  
                  const response = await fetch(`${apiUrl}/api/company`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...companyData, logo: newLogoUrl })
                  });

                  if (response.ok) {
                     setCompanyData({ ...companyData, logo: newLogoUrl });
                     window.dispatchEvent(new CustomEvent('companyDetailsUpdated', { 
                       detail: { 
                         companyName: companyData.companyName,
                         logo: newLogoUrl 
                       } 
                     }));
                     
                     Swal.fire({
                       title: 'Success!',
                       text: 'Profile photo updated successfully.',
                       icon: 'success',
                       confirmButtonColor: '#111827',
                       timer: 2000,
                       showConfirmButton: false
                     });
                  } else {
                     throw new Error('Failed to save company logo');
                  }
              } else {
                  throw new Error('Failed to upload image');
              }
            } catch (error) {
                console.error("Upload Error:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to update profile photo.',
                    icon: 'error',
                    confirmButtonColor: '#111827'
                });
            }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-minimal">
        <div className="spinner-minimal"></div>
      </div>
    );
  }

  return (
    <div className="profile-page-minimal">
      <div className="profile-container-minimal">
        <div className="profile-header-minimal">
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">Manage your personal information and security.</p>
        </div>

        <div className="profile-content-minimal">
          
          {/* User Details Card */}
          <div className="profile-card-minimal">
            <h2 className="card-title-minimal">Basic Information</h2>
            
            <div className="profile-avatar-section">
              <div className="avatar-wrapper-minimal">
                {companyData.logo ? (
                  <img src={getFullLogoUrl(companyData.logo)} alt="Logo" className="avatar-img-minimal" />
                ) : (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(companyData.companyName || 'Admin')}&background=0D8ABC&color=fff&size=150`} 
                    alt="Avatar" 
                    className="avatar-img-minimal"
                  />
                )}
                <button className="avatar-edit-minimal" onClick={() => fileInputRef.current.click()}>
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </div>
              <div className="avatar-info">
                <h3>{companyData.companyName || 'Unknown Company'}</h3>
              </div>
            </div>

            <div className="info-list-minimal">
              <div className="info-item-minimal">
                <div className="info-label">
                  <Phone size={16} />
                  <span>Phone Number</span>
                </div>
                <div className="info-value">{companyData.companyContact || 'Not Provided'}</div>
              </div>
              <div className="info-item-minimal">
                <div className="info-label">
                  <Mail size={16} />
                  <span>Email Address</span>
                </div>
                <div className="info-value">{companyData.companyEmail || 'Not Provided'}</div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="profile-card-minimal">
            <div className="card-header-minimal">
               <h2 className="card-title-minimal">Security</h2>
               <Lock size={18} className="header-icon"/>
            </div>
            
            <form onSubmit={handleSave} className="password-form-minimal">
              <div className="form-group-minimal">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword.current ? "text" : "password"} 
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password" 
                    required 
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('current')}>
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group-minimal">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword.new ? "text" : "password"} 
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password" 
                    required 
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('new')}>
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group-minimal">
                <label>Confirm Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword.confirm ? "text" : "password"} 
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password" 
                    required 
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('confirm')}>
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-minimal-primary" disabled={isChangingPassword}>
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
