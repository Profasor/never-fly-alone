import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

type Cell = {
  x: number;
  y: number;
};

type GameStatus = "idle" | "running" | "paused" | "over";

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Cell[] = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
const INITIAL_SPEED = 160;
const MIN_SPEED = 80;
const SPEED_STEP = 6;
const STORAGE_KEY = "snake-high-score";

function getRandomCell(exclude: Cell[]): Cell {
  const available: Cell[] = [];
  for (let x = 0; x < BOARD_SIZE; x += 1) {
    for (let y = 0; y < BOARD_SIZE; y += 1) {
      if (!exclude.some((cell) => cell.x === x && cell.y === y)) {
        available.push({ x, y });
      }
    }
  }
  return available[Math.floor(Math.random() * available.length)];
}

function isOppositeDirection(a: Direction, b: Direction) {
  return (
    (a === "UP" && b === "DOWN") ||
    (a === "DOWN" && b === "UP") ||
    (a === "LEFT" && b === "RIGHT") ||
    (a === "RIGHT" && b === "LEFT")
  );
}

function loadHighScore() {
  try {
    if (typeof window === "undefined") {
      return 0;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch (error) {
    console.warn("High score yüklenemedi", error);
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, String(score));
  } catch (error) {
    console.warn("High score kaydedilemedi", error);
  }
}

export function useSnakeGame() {
  const [snake, setSnake] = useState<Cell[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [apple, setApple] = useState<Cell>(() => getRandomCell(INITIAL_SNAKE));
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const highScoreRef = useRef(0);
  const [highScore, setHighScore] = useState(() => {
    const stored = loadHighScore();
    highScoreRef.current = stored;
    return stored;
  });

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setApple(getRandomCell(INITIAL_SNAKE));
    setStatus("idle");
    setScore(0);
    setSpeed(INITIAL_SPEED);
  }, []);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setApple(getRandomCell(INITIAL_SNAKE));
    setStatus("running");
    setScore(0);
    setSpeed(INITIAL_SPEED);
  }, []);

  const togglePause = useCallback(() => {
    setStatus((prev) => {
      if (prev === "running") return "paused";
      if (prev === "paused") return "running";
      return prev;
    });
  }, []);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };
      const pressed = keyMap[event.key];
      if (!pressed) return;
      setNextDirection((prev) => {
        if (isOppositeDirection(prev, pressed)) {
          return prev;
        }
        return pressed;
      });
    }

    function handlePause(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "p") {
        togglePause();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keydown", handlePause);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keydown", handlePause);
    };
  }, [togglePause]);

  const board = useMemo(() => ({ size: BOARD_SIZE }), []);

  useEffect(() => {
    if (status !== "running") return;

    const interval = window.setInterval(() => {
      let activeDirection = direction;
      if (direction !== nextDirection) {
        activeDirection = nextDirection;
        setDirection(nextDirection);
      }
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Cell = head;
        if (activeDirection === "UP") newHead = { x: head.x, y: head.y - 1 };
        if (activeDirection === "DOWN") newHead = { x: head.x, y: head.y + 1 };
        if (activeDirection === "LEFT") newHead = { x: head.x - 1, y: head.y };
        if (activeDirection === "RIGHT") newHead = { x: head.x + 1, y: head.y };

        const collisionWithWall =
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE;
        const collisionWithSelf = prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y,
        );

        if (collisionWithWall || collisionWithSelf) {
          setStatus("over");
          if (score > highScoreRef.current) {
            highScoreRef.current = score;
            setHighScore(score);
            saveHighScore(score);
          }
          return prevSnake;
        }

        const segments = [newHead, ...prevSnake];
        const isApple = newHead.x === apple.x && newHead.y === apple.y;
        if (!isApple) {
          segments.pop();
          return segments;
        }

        const nextScore = score + 10;
        setScore(nextScore);
        if (nextScore > highScoreRef.current) {
          highScoreRef.current = nextScore;
          setHighScore(nextScore);
          saveHighScore(nextScore);
        }
        setApple(getRandomCell(segments));
        setSpeed((prevSpeed) => Math.max(prevSpeed - SPEED_STEP, MIN_SPEED));
        return segments;
      });
    }, speed);

    return () => window.clearInterval(interval);
  }, [apple, direction, nextDirection, score, speed, status]);

  return {
    board,
    snake,
    apple,
    status,
    score,
    highScore,
    startGame,
    togglePause,
    resetGame,
  };
}
