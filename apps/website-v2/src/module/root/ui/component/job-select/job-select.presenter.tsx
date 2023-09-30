'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@shio/core/component/select';
import { ArrowHeadIcon } from '@shio/core/icon/arrow-head-icon';
import { toKebabCase, toTitleCase } from '@shio/core/util/change-case';
import { type ComponentPropsWithoutRef, type ReactNode, useEffect, useState } from 'react';
import { jobs } from '#website-v2/module/root/constant/job';

type JobSelectProps = Omit<ComponentPropsWithoutRef<typeof Select>, 'children' | 'className' | 'onValueChange' | 'value'> & {
  selectedJobLabel: keyof typeof jobs;
  onJobLabelChange: (job: keyof typeof jobs) => void;
};

export const JobSelect = ({ selectedJobLabel, onJobLabelChange, ...props }: JobSelectProps): ReactNode => {
  const jobLabels = Object.keys(jobs) as (keyof typeof jobs)[];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Select
      value={mounted ? toTitleCase(selectedJobLabel) : undefined}
      onValueChange={(jobValue) => {
        const jobLabel = toKebabCase(jobValue) as keyof typeof jobs;
        if (!jobLabels.includes(jobLabel)) {
          throw new Error(`Invalid jobLabel: ${jobLabel}`);
        }

        onJobLabelChange(jobLabel);
      }}
      {...props}
    >
      <SelectTrigger
        aria-label="job selector"
        aria-description={`Selector to choose between ${jobLabels.join(', ')}.`}
        display="inline-flex"
        color="purple"
        textSize={{
          initial: '3xl',
          tablet: '6xl',
          laptop: '7xl',
        }}
        rounded="2xl"
        icon={ArrowHeadIcon}
      >
        {toTitleCase(selectedJobLabel)}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {jobLabels.map((jobLabel) => (
            <SelectItem key={jobLabel} value={toTitleCase(jobLabel)}>
              <span className="flex items-center gap-3">{jobLabel}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
