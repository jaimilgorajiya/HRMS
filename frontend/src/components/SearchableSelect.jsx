import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

const SearchableSelect = ({ 
    options, 
    value, 
    onChange, 
    placeholder = "Select...", 
    label = "", 
    searchable = false,
    multiple = false,
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (optionValue) => {
        if (multiple) {
            const newValue = Array.isArray(value) ? [...value] : [];
            const index = newValue.indexOf(optionValue);
            if (index === -1) {
                newValue.push(optionValue);
            } else {
                newValue.splice(index, 1);
            }
            onChange(newValue);
        } else {
            onChange(optionValue);
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    const removeOption = (e, optionValue) => {
        e.stopPropagation();
        if (multiple && Array.isArray(value)) {
            const newValue = value.filter(v => v !== optionValue);
            onChange(newValue);
        }
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

    const getSelectedLabels = () => {
        if (multiple) {
            if (!Array.isArray(value) || value.length === 0) return null;
            return options.filter(opt => value.includes(opt.value));
        }
        return options.find(opt => opt.value === value);
    };

    const selected = getSelectedLabels();

    return (
        <div className="searchable-select-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            {label && (
                <label style={{ fontSize: '14.5px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                    {label} {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
                </label>
            )}
            
            <div 
                className={`select-trigger ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                onMouseEnter={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.backgroundColor = '#fff';
                    }
                }}
                style={{
                    minHeight: '45px',
                    padding: '8px 16px',
                    border: isOpen ? '1.5px solid #3B648B' : '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    backgroundColor: isOpen ? '#fff' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isOpen ? '0 0 0 4px rgba(59, 100, 139, 0.12), 0 4px 12px rgba(15, 23, 42, 0.08)' : '0 1px 2px rgba(15, 23, 42, 0.05)',
                }}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
                    {multiple ? (
                        selected && selected.length > 0 ? (
                            selected.map(opt => (
                                <span key={opt.value} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: 'rgba(59, 100, 139, 0.08)',
                                    color: '#3B648B',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    border: '1px solid rgba(59, 100, 139, 0.15)'
                                }}>
                                    {opt.label}
                                    <X 
                                        size={14} 
                                        onClick={(e) => removeOption(e, opt.value)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </span>
                            ))
                        ) : <span style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '500' }}>{placeholder}</span>
                    ) : (
                        <span style={{ color: selected ? '#1E293B' : '#94A3B8', fontSize: '15px', fontWeight: '500' }}>
                            {selected ? selected.label : placeholder}
                        </span>
                    )}
                </div>
                <ChevronDown size={18} style={{ color: '#64748B', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', marginLeft: '8px' }} />
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
                        <div style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', color: '#94A3B8' }} />
                                <input 
                                    type="text"
                                    autoFocus
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        width: '100%',
                                        height: '36px',
                                        padding: '0 10px 0 32px',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: '#F8FAFC'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    
                    <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '4px' }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = multiple 
                                    ? Array.isArray(value) && value.includes(option.value)
                                    : value === option.value;

                                return (
                                    <div 
                                        key={option.value}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect(option.value);
                                        }}
                                        style={{
                                            padding: '8px 12px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: isSelected ? '#3B648B' : '#475569',
                                            backgroundColor: isSelected ? 'rgba(59, 100, 139, 0.08)' : 'transparent',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'background 0.1s',
                                            marginBottom: '2px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isSelected ? 'rgba(59, 100, 139, 0.08)' : '#F8FAFC'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? 'rgba(59, 100, 139, 0.08)' : 'transparent'}
                                    >
                                        {option.label}
                                        {isSelected && <Check size={16} />}
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>
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

