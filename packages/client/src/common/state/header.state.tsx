import type { RefObject } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { atomKeys } from '@/common/constant/recoil-key.constant';

const headerState = atom<RefObject<HTMLElement> | undefined>({
  key: atomKeys.HEADER,
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const useHeaderHeight = () => {
  const headerRef = useRecoilValue(headerState);

  return headerRef?.current?.offsetHeight;
};

export const useSetHeaderRef = () => {
  const setUserRecoil = useSetRecoilState(headerState);

  return setUserRecoil;
};
