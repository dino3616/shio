import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import BrandShioImage from '@/core/asset/brand/shio.png';
import { Image } from '@/core/component/image';
import { Link } from '@/core/component/link';
import { DiscordIcon } from '@/core/icon/discord-icon';
import { FigmaIcon } from '@/core/icon/figma-icon';
import { GithubIcon } from '@/core/icon/github-icon';
import { InstagramIcon } from '@/core/icon/instagram-icon';
import { MailIcon } from '@/core/icon/mail-icon';
import { TwitterIcon } from '@/core/icon/twitter-icon';
import { cn } from '@/core/util/cn';

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, 'children'>;

export const Footer = ({ className, ...props }: FooterProps): ReactNode => (
  <footer className={cn('flex w-full flex-col items-center gap-6 p-6 tablet:gap-10 tablet:p-10', className)} {...props}>
    <div className="flex w-full flex-col justify-between gap-16 border-b-2 border-mauve-6 pb-6 tablet:pb-10 laptop:flex-row">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src={BrandShioImage} alt="An image of brand icon for shio." className="h-8 w-8 rounded-full" />
            <p className="text-2xl font-bold text-black hover:opacity-70 dark:text-white">
              <span className="text-purple-11">shio</span>.studio
            </p>
          </Link>
          <p className="text-mauve-11">Portfolio site of shio, a frontend engineer and designer.</p>
        </div>
        <ul className="flex items-center gap-4">
          <li className="border-r-2 border-mauve-11 pr-4">
            <ul className="flex items-center gap-4">
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
                <Link
                  aria-label="discord link"
                  aria-description="A link to Discord account of shio."
                  href="https://discordapp.com/users/699659576349294633/"
                  external
                >
                  <DiscordIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
                </Link>
              </li>
              <li>
                <Link aria-label="github link" aria-description="A link to GitHub account of shio." href="https://github.com/dino3616/" external>
                  <GithubIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
                </Link>
              </li>
              <li>
                <Link aria-label="mail link" aria-description="An E-mail address for shio." href="mailto:me@shio.studio" external>
                  <MailIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  aria-label="source code link"
                  aria-description="A link to the source code for this website hosted on GitHub."
                  href="https://github.com/dino3616/shio/"
                  external
                >
                  <GithubIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
                </Link>
              </li>
              <li>
                <Link
                  aria-label="design link"
                  aria-description="A link to the design for this website created by Figma."
                  href="https://www.figma.com/file/wIpzL4L6xxDhB7TGejMBBk/shio.studio?type=design&node-id=0%3A1&t=kBxA06Gtzi3Y0i09-1/"
                  external
                >
                  <FigmaIcon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <nav aria-label="footer navigation">
        <ul className="flex gap-16">
          <li className="flex flex-col gap-5">
            <p className="text-lg font-bold text-mauve-11">Work</p>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/" className="text-xl text-mauve-12 transition hover:text-mauve-11">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/" className="text-xl text-mauve-12 transition hover:text-mauve-11">
                  Skill
                </Link>
              </li>
              <li>
                <Link href="/" className="text-xl text-mauve-12 transition hover:text-mauve-11">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/" className="text-xl text-mauve-12 transition hover:text-mauve-11">
                  Studio
                </Link>
              </li>
            </ul>
          </li>
          <li className="flex flex-col gap-5">
            <p className="text-lg font-bold text-mauve-11">Blog</p>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/" className="text-xl text-mauve-12 transition hover:text-mauve-11">
                  List
                </Link>
              </li>
            </ul>
          </li>
          <li className="flex flex-col gap-5">
            <p className="text-lg font-bold text-mauve-11">Me</p>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/" className="text-xl text-mauve-12 transition hover:text-mauve-11">
                  Contact
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
    <small className="text-sm text-mauve-11">Copyright &copy; shio all right reserved.</small>
  </footer>
);
