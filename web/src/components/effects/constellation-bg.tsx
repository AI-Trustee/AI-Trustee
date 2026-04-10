"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  connections: number[];
}

interface TraceLine {
  from: number;
  to: number;
  progress: number;
  speed: number;
  active: boolean;
  cooldown: number;
}

const EMERALD = "#10b981";
const CYAN = "#06b6d4";
const AMBER = "#f59e0b";

export function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const tracesRef = useRef<TraceLine[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      const w = canvas.width;
      const h = canvas.height;
      const spacing = 120;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const nodes: Node[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offsetX = r % 2 === 0 ? 0 : spacing * 0.5;
          nodes.push({
            x: c * spacing + offsetX + (Math.random() - 0.5) * 30,
            y: r * spacing + (Math.random() - 0.5) * 30,
            radius: Math.random() * 2 + 1,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.005 + Math.random() * 0.01,
            connections: [],
          });
        }
      }

      // Build connections (circuit traces) - connect nearby nodes with right-angle paths
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < spacing * 1.5 && Math.random() < 0.3) {
            nodes[i].connections.push(j);
          }
        }
      }

      nodesRef.current = nodes;

      // Create animated trace lines
      const traces: TraceLine[] = [];
      for (let i = 0; i < Math.min(8, nodes.length); i++) {
        const nodeIdx = Math.floor(Math.random() * nodes.length);
        const node = nodes[nodeIdx];
        if (node.connections.length > 0) {
          const connIdx = node.connections[Math.floor(Math.random() * node.connections.length)];
          traces.push({
            from: nodeIdx,
            to: connIdx,
            progress: 0,
            speed: 0.003 + Math.random() * 0.005,
            active: true,
            cooldown: Math.random() * 300,
          });
        }
      }
      tracesRef.current = traces;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;
      const traces = tracesRef.current;
      const mouse = mouseRef.current;

      // Draw circuit trace connections
      for (const node of nodes) {
        for (const connIdx of node.connections) {
          const target = nodes[connIdx];
          const midX = node.x;
          const midY = target.y;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(midX, midY);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = "rgba(16, 185, 129, 0.06)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(frame * node.pulseSpeed + node.pulsePhase);
        const alpha = 0.15 + pulse * 0.1;
        const r = node.radius + pulse * 0.5;

        // Mouse proximity glow
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseAlpha = dist < 200 ? (200 - dist) / 200 * 0.4 : 0;

        // Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = EMERALD;
        ctx.globalAlpha = alpha + mouseAlpha;
        ctx.fill();

        // Node glow
        if (mouseAlpha > 0.1) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
          ctx.fillStyle = EMERALD;
          ctx.globalAlpha = mouseAlpha * 0.15;
          ctx.fill();
        }
      }

      // Draw animated traveling pulses along traces
      ctx.globalAlpha = 1;
      for (const trace of traces) {
        if (trace.cooldown > 0) {
          trace.cooldown--;
          continue;
        }

        const fromNode = nodes[trace.from];
        const toNode = nodes[trace.to];
        if (!fromNode || !toNode) continue;

        trace.progress += trace.speed;
        if (trace.progress > 1) {
          trace.progress = 0;
          trace.cooldown = 100 + Math.random() * 200;
          // Pick new random connection
          const node = nodes[trace.from];
          if (node.connections.length > 0) {
            trace.to = node.connections[Math.floor(Math.random() * node.connections.length)];
          }
          continue;
        }

        // Right-angle path: go horizontal first, then vertical
        const midX = fromNode.x;
        const midY = toNode.y;

        let px: number, py: number;
        const totalDist = Math.abs(fromNode.y - midY) + Math.abs(midX - toNode.x);
        const leg1 = Math.abs(fromNode.y - midY);
        const leg1Ratio = totalDist > 0 ? leg1 / totalDist : 0.5;

        if (trace.progress < leg1Ratio) {
          const t = trace.progress / leg1Ratio;
          px = fromNode.x;
          py = fromNode.y + (midY - fromNode.y) * t;
        } else {
          const t = (trace.progress - leg1Ratio) / (1 - leg1Ratio);
          px = midX + (toNode.x - midX) * t;
          py = midY;
        }

        // Pulse dot
        const isAmber = trace.from % 5 === 0;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isAmber ? AMBER : CYAN;
        ctx.globalAlpha = 0.8;
        ctx.fill();

        // Pulse glow
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = isAmber ? AMBER : CYAN;
        ctx.globalAlpha = 0.15;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ willChange: "transform" }}
    />
  );
}
