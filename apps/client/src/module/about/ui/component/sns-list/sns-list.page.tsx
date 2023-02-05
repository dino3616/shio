import type { ComponentPropsWithoutRef, FC } from 'react';
import { AiFillGithub, AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { SiQiita, SiZenn } from 'react-icons/si';
import { Link } from '@/common/component/link/link.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type SnsListProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children'>;

export const SnsList: FC<SnsListProps> = ({ className, ...props }) => (
  <ul className={twMerge('text-gray-500 flex gap-3', className)} {...props}>
    <li>
      <Link href="https://twitter.com/shio3616" target="_blank">
        <AiOutlineTwitter size={36} />
      </Link>
    </li>
    <li>
      <Link href="https://www.instagram.com/shio_dino/" target="_blank">
        <AiFillInstagram size={36} />
      </Link>
    </li>
    <li>
      <Link href="https://discordapp.com/users/699659576349294633" target="_blank">
        <FaDiscord size={36} />
      </Link>
    </li>
    <li>
      <Link href="https://github.com/dino3616" target="_blank">
        <AiFillGithub size={36} />
      </Link>
    </li>
    <li>
      <Link href="https://qiita.com/dino3616" target="_blank">
        <SiQiita size={36} />
      </Link>
    </li>
    <li>
      <Link href="https://zenn.dev/dino3616" target="_blank">
        <SiZenn size={36} />
      </Link>
    </li>
  </ul>
);
