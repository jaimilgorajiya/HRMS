import React from 'react';

const ModulePlaceholder = ({ title }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#64748B' }}>{title} Module</h2>
      <p style={{ color: '#94A3B8' }}>This module is currently under development.</p>
      <div style={{ marginTop: '20px', padding: '40px', background: '#F8FAFC', borderRadius: '12px', border: '2px dashed #E2E8F0' }}>
        <p>Coming Soon...</p>
      </div>
    </div>
  );
};

export default ModulePlaceholder;
