import clsx from "clsx";
import { useMemo } from "react";
import { useSnakeGameContext } from "../contexts/SnakeGameContext";
import styles from "../styles/SnakeGame.module.css";

export default function SnakeGame() {
  const { board, snake, apple, status, score, highScore, startGame, togglePause, resetGame } =
    useSnakeGameContext();

  const cells = useMemo(() => {
    const grid = Array.from({ length: board.size }, (_, y) =>
      Array.from({ length: board.size }, (_, x) => {
        const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        const isApple = apple.x === x && apple.y === y;
        return { key: `${x}-${y}`, isSnake, isApple, isHead };
      }),
    );
    return grid;
  }, [apple, board.size, snake]);

  return (
    <section className={styles.container}>
      <header className={styles.panel}>
        <div>
          <p className={styles.status}>
            Durum: <strong>{statusLabel(status)}</strong>
          </p>
          <p className={styles.scores}>
            Skor: <span>{score}</span> • En yüksek skor: <span>{highScore}</span>
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={startGame} className={styles.primary}>
            Başlat
          </button>
          <button type="button" onClick={togglePause}>
            {status === "paused" ? "Devam Et" : "Duraklat"}
          </button>
          <button type="button" onClick={resetGame}>
            Yeniden Başlat
          </button>
        </div>
      </header>
      <div className={styles.board}>
        {cells.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map((cell) => (
              <div
                key={cell.key}
                className={clsx(styles.cell, {
                  [styles.snake]: cell.isSnake,
                  [styles.head]: cell.isHead,
                  [styles.apple]: cell.isApple,
                })}
              />
            ))}
          </div>
        ))}
      </div>
      {status === "over" && <div className={styles.overlay}>Oyun Bitti! Tekrar deneyin 🎮</div>}
    </section>
  );
}

function statusLabel(status: ReturnType<typeof useSnakeGameContext>["status"]) {
  if (status === "running") return "Çalışıyor";
  if (status === "paused") return "Duraklatıldı";
  if (status === "over") return "Bitti";
  return "Hazır";
}
