import { useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useChains,
  useSignMessage,
} from "wagmi";
import { base } from "wagmi/chains";
import { useSnakeGameContext } from "../contexts/SnakeGameContext";
import styles from "../styles/IntegrationPanel.module.css";

export default function IntegrationPanel() {
  const { score, highScore, status } = useSnakeGameContext();
  const { address, isConnected, chain } = useAccount();
  const { connectAsync, status: connectStatus, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain, isLoading: isSwitching } = useSwitchChain();
  const availableChains = useChains();
  const { signMessageAsync, data: signature } = useSignMessage();
  const [signError, setSignError] = useState<string | null>(null);

  const baseChain = useMemo(() => chains.find((item) => item.id === base.id), [chains]);
  const isOnBase = chain?.id === base.id;

  async function handleConnect() {
    try {
      const injectedConnector = connectors.find((item) => item.id === "injected") ?? connectors[0];
      if (!injectedConnector) {
        throw new Error("Uygun bir cüzdan konektörü bulunamadı");
      }
      await connectAsync({ connector: injectedConnector });
    } catch (error) {
      console.error("Cüzdan bağlantısı başarısız", error);
    }
  }

  async function handleSwitch(targetId: number) {
    try {
      switchChain({ chainId: targetId });
    } catch (error) {
      console.error("Ağ değiştirilemedi", error);
    }
  }

  async function handleSignScore() {
    try {
      setSignError(null);
      const timestamp = new Date().toISOString();
      await signMessageAsync({
        message: `Base Snake Score\nSkor: ${score}\nEn yüksek skor: ${highScore}\nDurum: ${status}\nZaman damgası: ${timestamp}`,
      });
    } catch (error) {
      console.error("İmza başarısız", error);
      setSignError("İmza alınamadı. Cüzdan izinlerini kontrol edin.");
    }
  }

  function handleShare() {
    const text = encodeURIComponent(
      `Yılan Oyunu skorumu Base üzerinde imzaladım! Son skor: ${score}. Sen de dene:`,
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://warpcast.com/~/compose?text=${text}&embeds[]=${url}`, "_blank");
  }

  return (
    <section className={styles.container}>
      <header>
        <h2>Base & Farcaster Entegrasyonu</h2>
        <p>Cüzdanınızı bağlayın, Base ağına geçin ve skorunuzu imzalayıp paylaşın.</p>
      </header>
      <div className={styles.card}>
        <h3>Cüzdan Durumu</h3>
        <p>{isConnected ? `Bağlı adres: ${address}` : "Cüzdan bağlı değil."}</p>
        <div className={styles.actions}>
          {isConnected ? (
            <button type="button" onClick={() => disconnect()}>Bağlantıyı Kes</button>
          ) : (
            <button type="button" onClick={handleConnect} disabled={connectStatus === "pending"}>
              {connectStatus === "pending" ? "Bağlanıyor..." : "Cüzdanı Bağla"}
            </button>
          )}
        </div>
      </div>
      <div className={styles.card}>
        <h3>Ağ Seçimi</h3>
        <p>Aktif ağ: {chain ? chain.name : "—"}</p>
        <div className={styles.actions}>
          {availableChains.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSwitch(item.id)}
              disabled={isSwitching || chain?.id === item.id}
            >
              {chain?.id === item.id ? `${item.name} aktif` : `${item.name}'e geç`}
            </button>
          ))}
        </div>
        {!baseChain && (
          <p className={styles.helper}>
            Base ağı listede yoksa MetaMask ağ ayarlarına manuel olarak ekleyin: Chain ID 8453,
            RPC {import.meta.env.VITE_BASE_RPC_URL ?? base.rpcUrls.public.http[0]}.
          </p>
        )}
      </div>
      <div className={styles.card}>
        <h3>Skoru İmzala</h3>
        <p>
          {isOnBase
            ? "Skorunuzu Base ağı üzerinde imzalamak için aşağıdaki butonu kullanın."
            : "İmzalamadan önce Base ağına geçmelisiniz."}
        </p>
        <button type="button" onClick={handleSignScore} disabled={!isConnected || !isOnBase}>
          Skorumu İmzala
        </button>
        {signature && (
          <div className={styles.signature}>
            <span>İmza:</span>
            <code>{signature.slice(0, 26)}…{signature.slice(-6)}</code>
          </div>
        )}
        {signError && <p className={styles.error}>{signError}</p>}
      </div>
      <div className={styles.card}>
        <h3>Farcaster'da Paylaş</h3>
        <p>Skorunuzu Farcaster'daki arkadaşlarınızla paylaşın.</p>
        <button type="button" onClick={handleShare} disabled={score === 0}>
          Warpcast'te Paylaş
        </button>
      </div>
    </section>
  );
}
