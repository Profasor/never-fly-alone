import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const rpcUrl = import.meta.env.VITE_BASE_RPC_URL;

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [base.id]: http(rpcUrl ?? base.rpcUrls.public.http[0]),
    [baseSepolia.id]: http(baseSepolia.rpcUrls.public.http[0]),
  },
});
