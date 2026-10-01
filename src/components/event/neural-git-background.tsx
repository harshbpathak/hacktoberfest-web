import { motion, useReducedMotion } from "framer-motion";

const nodes = [
  { x: 9, y: 67 }, { x: 20, y: 51 }, { x: 32, y: 58 }, { x: 42, y: 36 },
  { x: 55, y: 43 }, { x: 67, y: 26 }, { x: 78, y: 35 }, { x: 91, y: 20 },
  { x: 68, y: 66 }, { x: 82, y: 75 }, { x: 92, y: 60 },
];

const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [4, 8], [8, 9], [9, 10]];

export function NeuralGitBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map(([from, to], index) => {
          const start = nodes[from];
          const end = nodes[to];
          if (!start || !end) return null;
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={start.x} y1={start.y} x2={end.x} y2={end.y}
              vectorEffect="non-scaling-stroke"
              className="stroke-branch"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 1.4, delay: index * 0.12 }}
            />
          );
        })}
      </svg>
      {nodes.map((node, index) => (
        <motion.span
          key={`${node.x}-${node.y}`}
          className="node absolute size-2 rounded-full"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          animate={reducedMotion ? undefined : { scale: [1, 1.8, 1], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.8, delay: index * 0.22, repeat: Infinity }}
        />
      ))}
    </div>
  );
}