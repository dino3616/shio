import BrandShioImage from '@shio/core/asset/brand/icon.webp';
import { Image } from '@shio/core/component/image';
import { Link } from '@shio/core/component/link';
import { ArrowRoundedIcon } from '@shio/core/icon/arrow-rounded-icon';
import { GithubIcon } from '@shio/core/icon/github-icon';
import { TagIcon } from '@shio/core/icon/tag-icon';
import { TwitterIcon } from '@shio/core/icon/twitter-icon';
import { cn } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ThemeSelect } from '@/module/root/ui/component/theme-select';

export type HeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'children' | 'className'> & {
  outsideClass?: ComponentPropsWithoutRef<'header'>['className'];
};

export const Header = ({ outsideClass, ...props }: HeaderProps): ReactNode => (
  <header className={cn('flex w-full items-center justify-between p-3 tablet:p-6', outsideClass)} {...props}>
    <nav aria-label="main navigation" className="flex items-center gap-6 laptop:gap-12">
      <Link href="/" className="flex items-center gap-3">
        <Image src={BrandShioImage} alt="A brand icon for shio." width={32} priority className="h-8 w-8 rounded-full" />
        <p className="hidden text-2xl font-bold text-dark-pure hover:opacity-70 dark:text-light-pure tablet:block">
          <span className="text-purple-11">shio</span>.studio
        </p>
      </Link>
      <ul className="flex items-center gap-2">
        <li>
          <Link href="/" className="group flex items-center gap-3 px-2 py-1 text-purple-12 transition hover:opacity-70 tablet:text-xl laptop:px-4">
            work
            <ArrowRoundedIcon className="h-4 w-4 fill-purple-12 group-hover:opacity-70 tablet:h-6 tablet:w-6" />
          </Link>
        </li>
        <li>
          <Link href="/" className="flex items-center gap-3 px-2 py-1 text-purple-12 transition hover:opacity-70 tablet:text-xl laptop:px-4">
            blog
          </Link>
        </li>
        <li>
          <Link href="/" className="flex items-center gap-3 px-2 py-1 text-purple-12 transition hover:opacity-70 tablet:text-xl laptop:px-4">
            contact
          </Link>
        </li>
      </ul>
    </nav>
    <div className="flex items-center gap-6">
      <ul className="hidden items-center gap-4 border-r-2 border-mauve-11 pr-6 laptop:flex">
        <li>
          <Link aria-label="twitter link" aria-description="A link to Twitter account of shio." href="https://twitter.com/shio3616/" external>
            <TwitterIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
          </Link>
        </li>
        <li>
          <Link aria-label="github link" aria-description="A link to GitHub account of shio." href="https://github.com/dino3616/" external>
            <GithubIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
          </Link>
        </li>
      </ul>
      <div className="hidden items-center gap-2 tablet:flex">
        <TagIcon className="h-5 w-5 fill-mauve-11" />
        <p className="font-bold text-mauve-11">v2</p>
      </div>
      <ThemeSelect />
    </div>
  </header>
);
