import type { ReactNode } from 'react';
import { HeroSection } from '@/module/root/ui/page/hero-section';
import { ProfileSection } from '@/module/root/ui/page/profile-section';

const RootPage = (): ReactNode => (
  <>
    <HeroSection />
    <ProfileSection />
  </>
);

export default RootPage;
