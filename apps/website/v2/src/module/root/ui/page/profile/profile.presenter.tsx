import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import BrandShioImage from '@/core/asset/brand/shio.png';
import ProfileActualPictureImage from '@/core/asset/profile/actual-picture.jpg';
import { Image } from '@/core/component/image';
import { Link } from '@/core/component/link';
import { DiscordIcon } from '@/core/icon/discord-icon';
import { GithubIcon } from '@/core/icon/github-icon';
import { InstagramIcon } from '@/core/icon/instagram-icon';
import { MailIcon } from '@/core/icon/mail-icon';
import { TwitterIcon } from '@/core/icon/twitter-icon';
import { cn } from '@/core/util/cn';
import { breakpoints } from '@/style/token';

type ProfileProps = ComponentPropsWithoutRef<'section'>;

export const Profile = ({ className, ...props }: ProfileProps): ReactNode => (
  <section className={cn('flex flex-col items-center gap-12 px-12 tablet:gap-28 tablet:px-20 laptop:px-28')} {...props}>
    <h1 className="text-4xl font-bold text-mauve-12 tablet:text-6xl laptop:text-7xl">
      Hi, I&apos;m <span className="text-purple-11">shio</span>!🧂
    </h1>
    <div className="flex flex-col items-end gap-6 tablet:gap-12">
      <div className="flex flex-col gap-6 tablet:flex-row tablet:gap-16">
        <div className="flex shrink-0 justify-center gap-4 laptop:justify-start">
          <Image
            src={BrandShioImage}
            alt="An image of brand icon for shio."
            sizes={`${breakpoints.laptop.mediaQuery} 200px, 180px`}
            className="h-[180px] w-[180px] laptop:h-[200px] laptop:w-[200px]"
          />
          <Image
            src={ProfileActualPictureImage}
            alt="An image of actual picture for shio."
            sizes={`${breakpoints.laptop.mediaQuery} 200px, 180px`}
            className="hidden h-[180px] w-[180px] laptop:block laptop:h-[200px] laptop:w-[200px]"
          />
        </div>
        <p className="text-lg text-mauve-11">
          Born on November 6, 2004.
          <br />
          Lives in Kasama City, Ibaraki Prefecture.
          <br />
          Engineer and designer who aims to provide the best web experience for any person in any environment.
        </p>
      </div>
      <ul className="flex items-center gap-3">
        <li>
          <Link aria-label="twitter link" aria-description="A link to Twitter account of shio." href="https://twitter.com/shio3616/" external>
            <TwitterIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
          </Link>
        </li>
        <li>
          <Link
            aria-label="instagram link"
            aria-description="A link to Instagram account of shio."
            href="https://www.instagram.com/shio_dino/"
            external
          >
            <InstagramIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
          </Link>
        </li>
        <li>
          <Link aria-label="discord link" aria-description="A link to Discord account of shio." href="https://www.instagram.com/shio_dino/" external>
            <DiscordIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
          </Link>
        </li>
        <li>
          <Link aria-label="github link" aria-description="A link to GitHub account of shio." href="https://www.instagram.com/shio_dino/" external>
            <GithubIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
          </Link>
        </li>
        <li>
          <Link aria-label="mail link" aria-description="An E-mail address for shio" href="mailto:me@shio.studio" external>
            <MailIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
          </Link>
        </li>
      </ul>
    </div>
  </section>
);
