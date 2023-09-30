'use client';

import { type ElementRef, type ReactNode, useRef } from 'react';
import { ContactSection } from '#website-v2/module/root/ui/page/contact-section';
import { HeroSection } from '#website-v2/module/root/ui/page/hero-section';
import { JobSection } from '#website-v2/module/root/ui/page/job-section';
import { ProfileSection } from '#website-v2/module/root/ui/page/profile-section';

const RootPage = (): ReactNode => {
  const profileSectionRef = useRef<ElementRef<typeof ProfileSection>>(null);

  return (
    <>
      <HeroSection
        onAboutMeButtonClick={() => {
          profileSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      <ProfileSection ref={profileSectionRef} />
      <JobSection />
      <ContactSection />
    </>
  );
};

export default RootPage;
