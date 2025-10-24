import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div>
        <h1>Yılan Oyunu</h1>
        <p>Base ağı ve Farcaster paylaşımıyla entegre edilmiş web oyunu.</p>
      </div>
      <a
        className={styles.link}
        href="https://base.org"
        target="_blank"
        rel="noreferrer"
      >
        Base Hakkında
      </a>
    </header>
  );
}
