import type { ReactNode } from 'react';
import { FeatureSection } from '@/module/root/ui/page/feature-section';
import { HeroSection } from '@/module/root/ui/page/hero-section';
import { ProfileSection } from '@/module/root/ui/page/profile-section';

const RootPage = (): ReactNode => (
  <>
    <HeroSection />
    <ProfileSection />
    <FeatureSection />
  </>
);

export default RootPage;
