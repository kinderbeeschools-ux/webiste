import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Building2, GraduationCap, School, BookOpen, TrendingUp, Headphones, ShieldCheck, Globe } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';
import { SchoolSetup } from '../components/SchoolSetup';
import { ArcadiaPage } from '../components/ArcadiaPage';
import { ConsultationOffer, openConsultationBooking } from '../components/ConsultationBooking';
import { SchoolPromoterGuide } from '../components/premium/SchoolPromoterGuide';
import { DegreeCollegeDiligence } from '../components/premium/DegreeCollegeDiligence';

export type FranchiseType = 'preschool' | 'cbse' | 'ib' | 'degree';

interface PartnershipsPageProps {
  subTab?: FranchiseType;
  onSelectSubTab?: (subTab: FranchiseType) => void;
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
}

export const PartnershipsPage: React.FC<PartnershipsPageProps> = ({ 
  subTab: externalSubTab, 
  onSelectSubTab, 
  onOpenConsultation, 
  settings 
}) => {
  const [internalSubTab, setInternalSubTab] = useState<FranchiseType>('cbse');

  useEffect(() => {
    if (externalSubTab) {
      setInternalSubTab(externalSubTab);
    }
  }, [externalSubTab]);

  const activeTab = externalSubTab || internalSubTab;
  const resolvedTab = (activeTab === 'ib' ? 'cbse' : activeTab);

  const handleTabChange = (tab: FranchiseType) => {
    const targetTab = tab === 'ib' ? 'cbse' : tab;
    setInternalSubTab(targetTab);
    if (onSelectSubTab) {
      onSelectSubTab(targetTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 pb-20 bg-[#FAF9F6]">
      <SEOHead 
        title={
          resolvedTab === 'cbse' ? "CBSE & IB School Setup & Consultancy" :
          "Degree College Setup & Consultancy"
        }
        description={"Explore Kinderbee's tailored franchisee partnership models: Preschool Franchises, CBSE & IB World School Setup, and Degree College Consultancy."}
        keywords={"preschool franchise india, zero royalty play school, CBSE school setup, IB school setup, degree college setup, CBSE and IB consultancy"}
        settings={settings}
      />


      {/* PAGE 2: CBSE & IB SCHOOL SETUP (COMBINED) */}
      {resolvedTab === 'cbse' && (
        <>
          <SchoolSetup onConsult={() => onOpenConsultation('cbse')} />
          <div className="mt-16">
            <SchoolPromoterGuide onConsult={() => onOpenConsultation('cbse')} settings={settings} />
          </div>
        </>
      )}

      {/* PAGE 3: DEGREE COLLEGE SETUP */}
      {resolvedTab === 'degree' && (
        <ArcadiaPage
          onRequestBrief={() => onOpenConsultation('degree')}
          extra={<DegreeCollegeDiligence onRequestBrief={() => onOpenConsultation('degree')} />}
        />
      )}
    </div>
  );
};
