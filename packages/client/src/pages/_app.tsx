import type { AppProps } from 'next/app';
import type { FC } from 'react';
import { RecoilRoot } from 'recoil';
import { Provider } from 'urql';
import { fontFamily } from '@/font/family';
import { urqlClient } from '@/infra/urql/urql.service';
import '@/style/global.css';

const GlobalHook: FC = () => null;

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <RecoilRoot>
    <GlobalHook />
    <Provider value={urqlClient}>
      <div className={`${fontFamily} font-sans`}>
        <Component {...pageProps} />
      </div>
    </Provider>
  </RecoilRoot>
);

export default App;
