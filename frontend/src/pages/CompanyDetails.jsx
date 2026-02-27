import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Globe, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Coins, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube,
  Upload,
  Save,
  CheckCircle2,
  Settings2,
  Map,
  Share2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Swal from 'sweetalert2';
import './CompanyDetails.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const CompanyDetails = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    timezone: 'Asia/Kolkata-Asia',
    address: '',
    companyEmail: '',
    companyContact: '',
    hrEmail: '',
    pincode: '',
    gstNumber: '',
    pan: '',
    tan: '',
    currency: '₹',
    socials: {
      instagram: '',
      facebook: '',
      linkedin: '',
      youtube: ''
    },
    location: {
      lat: 23.0225,
      lng: 72.5714
    }
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isRelocating, setIsRelocating] = useState(false);
  const fileInputRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7000";

  // Component to handle map clicks and marker dragging
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        if (!isRelocating) return;
        setFormData(prev => ({
          ...prev,
          location: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }
        }));
      },
    });

    const markerRef = useRef(null);
    const eventHandlers = {
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latLng.lat,
              lng: latLng.lng
            }
          }));
        }
      },
    };

    return (
      <Marker
        draggable={isRelocating}
        eventHandlers={eventHandlers}
        position={[formData.location.lat, formData.location.lng]}
        ref={markerRef}
      >
        <Popup>
          <div style={{ textAlign: 'center' }}>
            <strong>{formData.companyName || 'Office'}</strong><br />
            Lat: {formData.location.lat.toFixed(4)}, Lng: {formData.location.lng.toFixed(4)}
          </div>
        </Popup>
      </Marker>
    );
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/company`);
      const data = await response.json();
      if (data && data._id) {
        setFormData(data);
        if (data.logo) {
          setLogoPreview(data.logo.startsWith('http') ? data.logo : `${apiUrl}${data.logo}`);
        }
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialName = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while we save company details.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      let logoPath = formData.logo;

      if (logo) {
        const logoFormData = new FormData();
        logoFormData.append('file', logo);
        
        const token = localStorage.getItem('token');
        const uploadRes = await fetch(`${apiUrl}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: logoFormData
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          logoPath = uploadData.fileUrl;
        }
      }

      const response = await fetch(`${apiUrl}/api/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...formData, logo: logoPath })
      });

      if (response.ok) {
        Swal.fire({
          title: 'Updated!',
          text: 'Company details have been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#3A82F6'
        });
        fetchCompanyDetails();
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading company details...</div>;
  }

  return (
    <div className="company-details-container">
      <header className="company-details-header">
        <h1>Company Details</h1>
        {formData.updatedAt && (
          <div className="last-updated">
            Last Modified: {new Date(formData.updatedAt).toLocaleString()}
          </div>
        )}
      </header>

      <form onSubmit={handleUpdate} className="details-form">
        
        {/* Company Logo Section */}
        <section className="hrm-card">
          <div className="card-header-hrm">
            <h2><Upload size={18} /> Company Logo</h2>
          </div>
          <div className="card-body-hrm">
            <div className="logo-section-wrapper">
              <div className="logo-display">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company Logo" />
                ) : (
                  <div className="logo-empty">
                    <Building2 size={40} />
                    <span>No Logo</span>
                  </div>
                )}
              </div>
              <div className="upload-button-wrapper">
                <label className="btn-secondary">
                  <Upload size={16} />
                  Change Logo
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoChange} 
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </label>
                <span className="upload-hint">Recommended: JPG, PNG or SVG. Max size: 2MB.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section className="hrm-card">
          <div className="card-header-hrm">
            <h2><CheckCircle2 size={18} /> Basic Information</h2>
          </div>
          <div className="card-body-hrm">
            <div className="form-row">
              <div className="form-group-hrm">
                <label>Company Name <span>*</span></label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="form-control-hrm" required />
              </div>
              <div className="form-group-hrm">
                <label>Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="form-control-hrm" placeholder="https://www.company.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group-hrm">
                <label>Timezone <span>*</span></label>
                <select name="timezone" value={formData.timezone} onChange={handleInputChange} className="form-control-hrm" required>
                  <option value="Asia/Kolkata-Asia">Asia/Kolkata (GMT+5:30)</option>
                  <option value="UTC">UTC (00:00)</option>
                </select>
              </div>
              <div className="form-group-hrm">
                <label>Address <span>*</span></label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-control-hrm textarea-hrm" required placeholder="Full street address..."></textarea>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="hrm-card">
          <div className="card-header-hrm">
            <h2><Mail size={18} /> Contact Information</h2>
          </div>
          <div className="card-body-hrm">
            <div className="form-row">
              <div className="form-group-hrm">
                <label>Company Email <span>*</span></label>
                <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} className="form-control-hrm" required />
              </div>
              <div className="form-group-hrm">
                <label>Company Contact <span>*</span></label>
                <input type="tel" name="companyContact" value={formData.companyContact} onChange={handleInputChange} className="form-control-hrm" required />
              </div>
            </div>
            <div className="form-group-hrm">
              <label>HR / Management Email</label>
              <input type="email" name="hrEmail" value={formData.hrEmail || ''} onChange={handleInputChange} className="form-control-hrm" placeholder="hr@company.com" />
            </div>
          </div>
        </section>

        {/* Tax Information */}
        <section className="hrm-card">
          <div className="card-header-hrm">
            <h2><Settings2 size={18} /> Configurations & Tax</h2>
          </div>
          <div className="card-body-hrm">
            <div className="form-row">
              <div className="form-group-hrm">
                <label>Pincode <span>*</span></label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="form-control-hrm" required />
              </div>
              <div className="form-group-hrm">
                <label>Currency Symbol <span>*</span></label>
                <input type="text" name="currency" value={formData.currency} onChange={handleInputChange} className="form-control-hrm" required placeholder="₹" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group-hrm">
                <label>GST Number</label>
                <input type="text" name="gstNumber" value={formData.gstNumber || ''} onChange={handleInputChange} className="form-control-hrm" />
              </div>
              <div className="form-group-hrm">
                <label>PAN Number</label>
                <input type="text" name="pan" value={formData.pan || ''} onChange={handleInputChange} className="form-control-hrm" />
              </div>
            </div>
            <div className="form-group-hrm">
              <label>TAN Number</label>
              <input type="text" name="tan" value={formData.tan || ''} onChange={handleInputChange} className="form-control-hrm" />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="hrm-card">
          <div className="card-header-hrm">
            <h2><Share2 size={18} /> Social Links</h2>
          </div>
          <div className="card-body-hrm">
            <div className="social-links-hrm">
              <div className="form-group-hrm">
                <label>Instagram</label>
                <div className="social-input-group">
                  <div className="social-icon"><Instagram size={16} /></div>
                  <input type="text" name="social_instagram" value={formData.socials.instagram} onChange={handleInputChange} className="form-control-hrm social-input" placeholder="@handle" />
                </div>
              </div>
              <div className="form-group-hrm">
                <label>Facebook</label>
                <div className="social-input-group">
                  <div className="social-icon"><Facebook size={16} /></div>
                  <input type="text" name="social_facebook" value={formData.socials.facebook} onChange={handleInputChange} className="form-control-hrm social-input" placeholder="profile_url" />
                </div>
              </div>
              <div className="form-group-hrm">
                <label>LinkedIn</label>
                <div className="social-input-group">
                  <div className="social-icon"><Linkedin size={16} /></div>
                  <input type="text" name="social_linkedin" value={formData.socials.linkedin} onChange={handleInputChange} className="form-control-hrm social-input" placeholder="company_handle" />
                </div>
              </div>
              <div className="form-group-hrm">
                <label>YouTube</label>
                <div className="social-input-group">
                  <div className="social-icon"><Youtube size={16} /></div>
                  <input type="text" name="social_youtube" value={formData.socials.youtube} onChange={handleInputChange} className="form-control-hrm social-input" placeholder="channel_id" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="hrm-card">
          <div className="card-header-hrm">
            <div className="header-with-action">
              <h2><Map size={18} /> Office Location</h2>
              <button 
                type="button"
                className={`btn-relocate ${isRelocating ? 'active' : ''}`}
                onClick={() => setIsRelocating(!isRelocating)}
              >
                {isRelocating ? 'Click map or Drag marker' : 'Relocate Office'}
              </button>
            </div>
          </div>
          <div className="card-body-hrm">
            <div className={`map-container-hrm ${isRelocating ? 'editing' : ''}`}>
              {isRelocating && <div className="map-instruction">Relocation Mode Active</div>}
              <MapContainer 
                center={[formData.location.lat, formData.location.lng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
                />
                <LocationPicker />
              </MapContainer>
            </div>
          </div>
        </section>

        <footer className="form-footer-hrm">
          <button type="submit" className="btn-primary-hrm" disabled={updating}>
            <Save size={18} />
            {updating ? 'Saving Changes...' : 'Save Configuration'}
          </button>
        </footer>

      </form>
    </div>
  );
};

export default CompanyDetails;
