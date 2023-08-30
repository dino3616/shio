import type { ReactNode } from 'react';
import { HeroSection } from '@/module/root/ui/page/hero-section';
import { ProfileSection } from '@/module/root/ui/page/profile-section';

const RootPage = (): ReactNode => (
  <>
    <HeroSection />
    <ProfileSection />
    {/* TODO: Uncomment out when implementation is complete. */}
    {/* <FeatureSection /> */}
  </>
);

export default RootPage;
