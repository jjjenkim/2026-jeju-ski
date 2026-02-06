import React from 'react';
import './Cards.css';

export function PrimaryCard({ title, description, children }) {
      return (
            <div className="card primary-card">
                  <div className="card-content">
                        <h2>{title}</h2>
                        <p>{description}</p>
                        <div className="mockup-container">
                              {/* Simulated UI Content */}
                              <div style={{ padding: '20px' }}>
                                    <div style={{ width: '150px', height: '20px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '10px' }}></div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                          <div style={{ width: '40%', height: '100px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}></div>
                                          <div style={{ width: '55%', height: '100px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}></div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
