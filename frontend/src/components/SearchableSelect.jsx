import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder = "Select...", label = "", searchable = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option => 
        option.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="searchable-select-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            {label && <label style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B', marginBottom: '8px', display: 'block' }}>{label}</label>}
            
            <div 
                className={`select-trigger ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                style={{
                    height: '48px',
                    padding: '0 16px',
                    border: isOpen ? '1.5px solid #2563EB' : '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isOpen ? '0 0 0 4px rgba(37, 99, 235, 0.1)' : '0 1px 2px rgba(15, 23, 42, 0.05)',
                }}
            >
                <span style={{ color: selectedOption ? '#1E293B' : '#94A3B8', fontSize: '15px', fontWeight: '500' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={18} style={{ color: '#64748B', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
            </div>

            {isOpen && (
                <div className="select-dropdown-menu" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    animation: 'dropdownIn 0.2s ease-out'
                }}>
                    {searchable && (
                        <div style={{ padding: '6px', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', color: '#94A3B8' }} />
                                <input 
                                    type="text"
                                    autoFocus
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '30px',
                                        padding: '0 10px 0 30px',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '5px',
                                        fontSize: '12.5px',
                                        outline: 'none',
                                        backgroundColor: '#F8FAFC'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    
                    <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '3px' }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div 
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '13.5px',
                                        fontWeight: '500',
                                        color: (option.value === value || (option.value === false && value === false)) ? '#2563EB' : '#475569',
                                        backgroundColor: (option.value === value || (option.value === false && value === false)) ? '#EFF6FF' : 'transparent',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'background 0.1s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = (option.value === value || (option.value === false && value === false)) ? '#EFF6FF' : '#F8FAFC'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = (option.value === value || (option.value === false && value === false)) ? '#EFF6FF' : 'transparent'}
                                >
                                    {option.label}
                                    {(option.value === value || (option.value === false && value === false)) && <Check size={14} />}
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes dropdownIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default SearchableSelect;
