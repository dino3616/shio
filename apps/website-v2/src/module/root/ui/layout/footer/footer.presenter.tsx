import { getBaseUrl } from '#core/util/get-base-url';
import BrandShioImage from '@shio/core/asset/brand/icon.webp';
import { Image } from '@shio/core/component/image';
import { Link } from '@shio/core/component/link';
import { DiscordIcon } from '@shio/core/icon/discord-icon';
import { ExternalLinkIcon } from '@shio/core/icon/external-link-icon';
import { FigmaIcon } from '@shio/core/icon/figma-icon';
import { GithubIcon } from '@shio/core/icon/github-icon';
import { InstagramIcon } from '@shio/core/icon/instagram-icon';
import { MailIcon } from '@shio/core/icon/mail-icon';
import { TwitterIcon } from '@shio/core/icon/twitter-icon';
import { cn } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

// FIXME: If Omit<..., "children"> will result in an unexpected Link type.
type IconLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  icon: (props: ComponentPropsWithoutRef<'svg'>) => ReactNode;
};

const IconLink = ({ icon: Icon, ...props }: IconLinkProps): ReactNode => (
  <Link {...props}>
    <Icon className="h-6 w-6 fill-mauve-11 transition hover:opacity-70" />
  </Link>
);

type NavigationLinkProps = ComponentPropsWithoutRef<typeof Link>;

const NavigationLink = ({ className, children, ...props }: NavigationLinkProps): ReactNode => (
  <Link className={cn('group flex items-center gap-3 text-lg text-mauve-12 transition hover:text-mauve-11 tablet:text-xl', className)} {...props}>
    {children}
  </Link>
);

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, 'children' | 'className'> & {
  outsideClass?: ComponentPropsWithoutRef<'footer'>['className'];
};

export const Footer = ({ outsideClass, ...props }: FooterProps): ReactNode => (
  <footer className={cn('flex w-full flex-col items-center gap-6 p-6 tablet:gap-10 tablet:p-10', outsideClass)} {...props}>
    <div className="flex w-full flex-col justify-between gap-16 border-b-2 border-mauve-6 pb-6 tablet:pb-10 laptop:flex-row">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-70">
            <Image src={BrandShioImage} alt="A brand icon for shio." width={32} placeholder="empty" className="h-8 w-8 rounded-full" />
            <p className="text-2xl font-bold text-dark-pure dark:text-light-pure">
              <span className="text-purple-11">shio</span>.studio
            </p>
          </Link>
          <p className="text-mauve-11">Portfolio site of shio, a frontend engineer and designer.</p>
        </div>
        <ul className="flex items-center gap-4">
          <li className="border-r-2 border-mauve-11 pr-4">
            <p className="sr-only">Links to social media accounts of shio.</p>
            <ul className="flex items-center gap-4">
              <li>
                <IconLink
                  aria-label="twitter link"
                  aria-description="A link to Twitter."
                  href="https://twitter.com/shio3616/"
                  external
                  icon={TwitterIcon}
                />
              </li>
              <li>
                <IconLink
                  aria-label="instagram link"
                  aria-description="A link to Instagram."
                  href="https://www.instagram.com/shio_dino/"
                  external
                  icon={InstagramIcon}
                />
              </li>
              <li>
                <IconLink
                  aria-label="discord link"
                  aria-description="A link to Discord."
                  href="https://discordapp.com/users/699659576349294633/"
                  external
                  icon={DiscordIcon}
                />
              </li>
              <li>
                <IconLink
                  aria-label="github link"
                  aria-description="A link to GitHub."
                  href="https://github.com/dino3616/"
                  external
                  icon={GithubIcon}
                />
              </li>
              <li>
                <IconLink aria-label="e-mail link" aria-description="An E-mail address." href="mailto:me@shio.studio" external icon={MailIcon} />
              </li>
            </ul>
          </li>
          <li>
            <p className="sr-only">Links to resources related to this website.</p>
            <ul className="flex items-center gap-4">
              <li>
                <IconLink
                  aria-label="source code link"
                  aria-description="A link to the source code hosted on GitHub."
                  href="https://github.com/dino3616/shio/"
                  external
                  icon={GithubIcon}
                />
              </li>
              <li>
                <IconLink
                  aria-label="design link"
                  aria-description="A link to the design created by Figma."
                  href="https://www.figma.com/file/wIpzL4L6xxDhB7TGejMBBk/shio.studio?type=design&node-id=0%3A1&t=kBxA06Gtzi3Y0i09-1/"
                  external
                  icon={FigmaIcon}
                />
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <nav aria-label="footer navigation">
        <ul className="flex flex-wrap gap-12 tablet:gap-16">
          <li className="flex flex-col gap-5">
            <p className="font-bold text-mauve-11 tablet:text-lg">Work</p>
            <ul className="flex flex-col gap-4">
              <li>
                <NavigationLink href="/">Service</NavigationLink>
              </li>
              <li>
                <NavigationLink href="/">Experience</NavigationLink>
              </li>
              <li>
                <NavigationLink href="/">Studio</NavigationLink>
              </li>
            </ul>
          </li>
          <li className="flex flex-col gap-5">
            <p className="font-bold text-mauve-11 tablet:text-lg">Me</p>
            <ul className="flex flex-col gap-4">
              <li>
                <NavigationLink href="/">Blog</NavigationLink>
              </li>
              <li>
                <NavigationLink href="/">Contact</NavigationLink>
              </li>
            </ul>
          </li>
          <li className="flex flex-col gap-5">
            <p className="font-bold text-mauve-11 tablet:text-lg">Reference</p>
            <ul className="flex flex-col gap-4">
              <li>
                <NavigationLink href="https://github.com/dino3616/shio/" external>
                  Source code
                  <ExternalLinkIcon className="h-4 w-4 stroke-mauve-12 transition group-hover:stroke-mauve-11" />
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  href="https://www.figma.com/file/wIpzL4L6xxDhB7TGejMBBk/shio.studio?type=design&node-id=0%3A1&t=kBxA06Gtzi3Y0i09-1/"
                  external
                >
                  Design
                  <ExternalLinkIcon className="h-4 w-4 stroke-mauve-12 transition group-hover:stroke-mauve-11" />
                </NavigationLink>
              </li>
              <li>
                <NavigationLink href={getBaseUrl({ app: 'website-v1' })} external>
                  Version 1
                  <ExternalLinkIcon className="h-4 w-4 stroke-mauve-12 transition group-hover:stroke-mauve-11" />
                </NavigationLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
    <small className="text-sm text-mauve-11">Copyright &copy; shio all right reserved.</small>
  </footer>
);
