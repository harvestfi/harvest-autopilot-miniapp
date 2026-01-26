import { createConfig, http, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import farcasterFrame from "@farcaster/frame-wagmi-connector";
import { injected } from "wagmi/connectors";

// Initialize connectors
const frameConnector = farcasterFrame();
const injectedConnector = injected({
  shimDisconnect: true,
});

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org";

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(`${RPC_URL}`),
  },
  connectors: [frameConnector, injectedConnector],
  syncConnectedChain: true, // Ensure chain syncing
});

// Configure query client with proper settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000, // Consider data fresh for 1 second
      gcTime: 1000, // Keep unused data for 1 second
    },
  },
});

export default function WagmiAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
