'use client';

import { cn } from '@shio/tailwind';
import { AnimatePresence, motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react';
import { jobs } from '@/module/root/constant/job';
import { Feature } from '@/module/root/ui/component/feature';
import { JobSelect } from '@/module/root/ui/component/job-select';

type ScrollRevealPresenceProps = ComponentPropsWithoutRef<typeof motion.div>;

const ScrollRevealPresence = ({ children, ...props }: ScrollRevealPresenceProps): ReactNode => (
  <motion.div
    variants={{
      offscreen: {
        opacity: 0,
      },
      onscreen: {
        opacity: 1,
      },
    }}
    initial="offscreen"
    whileInView="onscreen"
    exit="offscreen"
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    {...props}
  >
    {children}
  </motion.div>
);

type JobSectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'className'>;

export const JobSection = ({ ...props }: JobSectionProps): ReactNode => {
  const [jobLabel, setJobLabel] = useState<keyof typeof jobs>('frontend-engineer');

  return (
    <section className="flex flex-col items-center gap-12 p-12 tablet:gap-28 tablet:px-20 laptop:px-28" {...props}>
      <h1 className="flex flex-col items-center gap-8 text-4xl font-bold text-mauve-12 tablet:text-6xl laptop:text-7xl desktop:flex-row">
        I&apos;m a ...,&nbsp;
        <JobSelect selectedJobLabel={jobLabel} onJobLabelChange={setJobLabel} />
      </h1>
      <motion.p
        key={`job-label-animation-${jobLabel}`}
        variants={{
          offscreen: {
            opacity: 0,
            scale: 0.5,
          },
          onscreen: {
            opacity: 1,
            scale: 1,
          },
        }}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
      >
        <span
          data-copy={jobs[jobLabel].copy}
          className={cn(
            'block max-w-5xl py-1 text-center text-3xl font-bold leading-tight tablet:text-5xl tablet:leading-tight laptop:text-6xl laptop:leading-tight',
            'bg-gradient-to-br from-mauve-12 bg-clip-text text-transparent',
            'before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:py-1 before:text-dark-mauve-12 before:content-[attr(data-copy)] before:dark:text-light-mauve-12',
          )}
        >
          {jobs[jobLabel].copy}
        </span>
      </motion.p>
      <AnimatePresence>
        <ScrollRevealPresence
          key={`feature-icon-list-animation-${jobLabel}`}
          className={cn(
            'relative flex gap-8 laptop:gap-12',
            "before:absolute before:right-[calc(100%+24px)] before:top-1/2 before:hidden before:h-0.5 before:w-24 before:-translate-y-1/2 before:rounded-full before:bg-gradient-to-l before:from-purple-6 before:content-[''] before:tablet:right-[calc(100%+48px)] before:tablet:block before:tablet:h-1 before:tablet:w-60",
            "after:absolute after:left-[calc(100%+24px)] after:top-1/2 after:hidden after:h-0.5 after:w-24 after:-translate-y-1/2 after:rounded-full after:bg-gradient-to-r after:from-purple-6 after:content-[''] after:tablet:left-[calc(100%+48px)] after:tablet:block after:tablet:h-1 after:tablet:w-60",
          )}
        >
          {jobs[jobLabel].features.map((feature) => (
            <feature.icon key={`feature-icon-${feature.label}`} className="h-7 w-7 tablet:h-8 tablet:w-8" />
          ))}
        </ScrollRevealPresence>
        <ScrollRevealPresence key={`feature-list-animation-${jobLabel}`} className="flex flex-col gap-16 laptop:gap-12">
          {jobs[jobLabel].features.map((feature, index) => (
            <Feature
              key={`feature-${feature.label}`}
              featureLabel={feature.label}
              featureDescription={feature.description}
              icon={feature.icon}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
              reverse={index % 2 !== 0}
            />
          ))}
        </ScrollRevealPresence>
      </AnimatePresence>
    </section>
  );
};
