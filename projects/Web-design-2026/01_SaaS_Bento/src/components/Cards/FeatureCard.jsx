import React from 'react';
import './Cards.css';

export function FeatureCard({ icon: Icon, title, description, isAccent }) {
      return (
            <div className={`card feature-card ${isAccent ? 'accent-card' : ''}`}>
                  {Icon && (
                        <div className="feature-card-icon">
                              <Icon size={24} />
                        </div>
                  )}
                  <h3>{title}</h3>
                  <p>{description}</p>
            </div>
      );
}
