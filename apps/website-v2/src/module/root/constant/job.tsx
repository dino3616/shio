import { DiamondIcon } from '@shio/core/icon/diamond-icon';
import { GridIcon } from '@shio/core/icon/grid-icon';
import { HeartIcon } from '@shio/core/icon/heart-icon';
import { PuzzlePieceIcon } from '@shio/core/icon/puzzle-piece-icon';
import { TimerIcon } from '@shio/core/icon/timer-icon';
import { cn } from '@shio/tailwind';
import type { DeepReadonly } from '@shio/type';
import Feature1Image from '#website-v2/module/root/asset/job/feature-1.png';
import Feature2Image from '#website-v2/module/root/asset/job/feature-2.png';
import Feature3Image from '#website-v2/module/root/asset/job/feature-3.png';
import Feature4Image from '#website-v2/module/root/asset/job/feature-4.png';
import Feature5Image from '#website-v2/module/root/asset/job/feature-5.png';
import type { Job } from '#website-v2/module/root/model/job';

export const jobs = {
  'frontend-engineer': {
    copy: 'Ease of use, ease of development, that kind of thing.',
    features: [
      {
        label: 'Accessibility',
        description:
          "I want to provide the best experience for any person in any environment. Performance, WAI-ARIA, SEO, style of hover / click / etc, I don't compromise on any of them. All for the best user experience.",
        icon: ({ className, ...props }) => <HeartIcon className={cn('fill-pink-9', className)} {...props} />,
        imageSrc: Feature1Image,
        imageAlt: 'Operating a variety of devices, including a mouse, laptop with keyboard, screen reader, and smartphone.',
      },
      {
        label: 'Scalability',
        description:
          'User first, but developer friendly; various tests by CI to validate changes, micro-front-end and mono-repo for optimal commonality and segmentation of code. Robust and scalable products are soon.',
        icon: ({ className, ...props }) => <DiamondIcon className={cn('fill-yellow-9', className)} {...props} />,
        imageSrc: Feature2Image,
        imageAlt: 'Stones processed into various shapes are piled up without gaps to form a wall.',
      },
      {
        label: 'Modernly',
        description:
          'Always at the forefront. In the field of the Web, where technology changes rapidly, I always keep up with the latest technologies and never forget to contribute to OSS.',
        icon: ({ className, ...props }) => <TimerIcon className={cn('fill-cyan-9', className)} {...props} />,
        imageSrc: Feature3Image,
        imageAlt: 'A lineup of logos for technologies that have appeared relatively recently, such as React.js, Turbo, Rome and Tauri, and more.',
      },
    ],
  },
  designer: {
    copy: 'Maximize the product value, optimize the UX, do both.',
    features: [
      {
        label: 'Accessibility',
        description:
          'Design in accordance with WCAG to meet the needs of users. Emphasis is placed on ensuring that everyone can access the best information in all environments by optimizing contrast ratios, choosing appropriate fonts, and providing alternative text.',
        icon: ({ className, ...props }) => <HeartIcon className={cn('fill-pink-9', className)} {...props} />,
        imageSrc: Feature1Image,
        imageAlt: 'Operating a variety of devices, including a mouse, laptop with keyboard, screen reader, and smartphone.',
      },
      {
        label: 'Consistency',
        description:
          'It is the foundation of a seamless user experience. Throughout the application, I try to unify typography, colors, shadows, and roundness to create a visually cohesive design. To achieve an intuitive interface, it is essential to establish a design system and guidelines.',
        icon: ({ className, ...props }) => <GridIcon className={cn('fill-yellow-9', className)} {...props} />,
        imageSrc: Feature4Image,
        imageAlt: 'Front view of the apartment building designed in orange and skin tone colors.',
      },
      {
        label: 'Usability',
        description:
          'Usability is at the core of design decisions. Pursue user-centered design through usability testing, user interviews, etc. Ensure that all users can reach the own goal without having to think about operations.',
        icon: ({ className, ...props }) => <PuzzlePieceIcon className={cn('fill-cyan-9', className)} {...props} />,
        imageSrc: Feature5Image,
        imageAlt: 'Top view of the team discussing around the table.',
      },
    ],
  },
} as const satisfies DeepReadonly<Record<string, Job>>;
