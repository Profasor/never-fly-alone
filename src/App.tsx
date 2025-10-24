import SnakeGame from "./components/SnakeGame";
import Header from "./components/Header";
import IntegrationPanel from "./components/IntegrationPanel";
import styles from "./styles/App.module.css";
import { SnakeGameProvider } from "./contexts/SnakeGameContext";

export default function App() {
  return (
    <SnakeGameProvider>
      <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
          <SnakeGame />
          <IntegrationPanel />
        </main>
      </div>
    </SnakeGameProvider>
  );
}
