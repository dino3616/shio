import type { fonts } from '@shio/design-token';
import { Fira_Code, Noto_Sans } from 'next/font/google';

// HACK: Since SWC forces argument properties to be written in literals, fonts cannot be used interchangeably.
// Therefore, the consistency of variable is only ensured by generics.
const firaCode = Fira_Code<(typeof fonts)['fira-code']['variable']>({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-fira-code',
});

const notoSans = Noto_Sans<(typeof fonts)['noto-sans']['variable']>({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
});

export const fontFamily = [firaCode, notoSans].map((font) => font.variable).join(' ');
