import React from 'react';
import { PrimaryCard } from './Cards/PrimaryCard';
import { FeatureCard } from './Cards/FeatureCard';
import { Zap, Shield, BarChart3, Users, Layout, Globe } from 'lucide-react';
import './BentoGrid.css';

export function BentoGrid() {
      return (
            <div className="container">
                  <div className="bento-grid">
                        <PrimaryCard
                              title="Performance First"
                              description="Experience the speed of 2026 web standards. Optimized for Core Web Vitals and LCP < 1.2s."
                        />

                        <FeatureCard
                              icon={Zap}
                              title="Lightning Fast"
                              description="Zero-latency interactions with optimized builds."
                        />

                        <FeatureCard
                              icon={Shield}
                              title="Secure by Design"
                              description="Enterprise-grade security protocols standard."
                        />

                        <FeatureCard
                              icon={Layout}
                              title="Bento Layout"
                              description="Modular grid system for perfect information hierarchy."
                              isAccent={true}
                        />

                        <FeatureCard
                              icon={Users}
                              title="Collaborative"
                              description="Real-time cursors and comments for teams."
                        />
                        <FeatureCard
                              icon={Globe}
                              title="Global Scale"
                              description="Deployed on edge networks worldwide."
                        />
                        <FeatureCard
                              icon={BarChart3}
                              title="Analytics"
                              description="Deep insights into user behavior."
                        />
                  </div>
            </div>
      );
}
