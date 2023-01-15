import { FC, useEffect, useState } from 'react';
import { Meta as MetaPresenter } from './meta.presenter';

export type MetaProps = {
  title: string;
};

export const Meta: FC<MetaProps> = ({ title }) => {
  const [hostname, setHostname] = useState('shio.vercel.app');

  useEffect(() => {
    if (window && window.location) {
      setHostname(window.location.hostname);
    }
  }, []);

  return <MetaPresenter title={title} hostname={hostname} />;
};
