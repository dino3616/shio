'use client';

import { cn } from '@shio/tailwind';
import { AnimatePresence, motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react';
import { jobs } from '@/module/root/constant/job';
import { Feature } from '@/module/root/ui/component/feature';
import { JobSelect } from '@/module/root/ui/component/job-select';

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
            'block max-w-5xl text-center text-3xl font-bold leading-tight tablet:text-5xl tablet:leading-tight laptop:text-6xl laptop:leading-tight',
            'bg-gradient-to-br from-mauve-12 bg-clip-text text-transparent',
            'before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:text-dark-mauve-12 before:content-[attr(data-copy)] before:dark:text-light-mauve-12',
          )}
        >
          {jobs[jobLabel].copy}
        </span>
      </motion.p>
      <AnimatePresence>
        <motion.div
          key={`feature-container-animation-${jobLabel}`}
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
          className="flex flex-col gap-16 laptop:gap-12"
        >
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
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
