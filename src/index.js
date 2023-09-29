import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
const { chains, publicClient, webSocketClient } = configureChains(
  [mainnet, sepolia],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_APP_ALCHEMY_API_KEY }),
    publicProvider()
  ]
);
const {connectors} = getDefaultWallets({
  appName: "Academic Transcripts",
  projectId: import.meta.env.REACT_APP_WALLET_C_PROJECT_ID,
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketClient
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App/>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
