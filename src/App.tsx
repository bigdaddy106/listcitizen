import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import merge from "lodash.merge";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";
import {
  WagmiConfig,
  createConfig,
  configureChains,
  useContractEvent,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Log } from "viem";
import Header from "./components/layout/Header";
import EnsAvatar from "./components/images/EnsAvatar";
import Citizens from "./pages/citizens";
import Add from "./pages/add";
import { AppDispatch, AppState } from "./redux/store";
import { CitizensServices } from "./redux/slices/citizens";
import { decodeLogsToCitizens, getNoteByIdRange } from "./utils/web3";
import { address } from "./constants/contract";
import FETestTaskABI from "./abis/FETestTask .json";

import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";

// Configure chains & providers with the Alchemy provider.
const { chains, publicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Securrency CitizenList",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
  chains,
});

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// Define the theme
const customTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#07296d",
  },
} as Theme);

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector((state: AppState) => state.citizens);

  async function addDataFromWatchedEvent(logs: Log[]) {
    const citizens = await decodeLogsToCitizens(logs);
    const someNotes = await getNoteByIdRange(data.length, 1);
    someNotes.forEach((someNote, index) => {
      citizens[index].someNote = someNote;
    });
    dispatch(CitizensServices.actions.pushData(citizens));
  }

  useContractEvent({
    address,
    abi: FETestTaskABI,
    eventName: "Citizen",
    listener(logs) {
      addDataFromWatchedEvent(logs);
    },
  });

  return (
    <div className="App">
      <WagmiConfig config={config}>
        <RainbowKitProvider
          chains={chains}
          theme={customTheme}
          avatar={EnsAvatar}
        >
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Navigate to="/citizens" />} />
              <Route path="/citizens" element={<Citizens />} />
              <Route path="/add" element={<Add />} />
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
