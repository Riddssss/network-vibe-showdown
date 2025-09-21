import { cn } from "@/lib/utils";
import { NodeData } from "./NetworkSimulation";

interface NetworkNodeProps extends NodeData {
  onClick: () => void;
}

export const NetworkNode = ({ id, x, y, type, isActive, isFailed, onClick }: NetworkNodeProps) => {
  const getNodeStyle = () => {
    if (isFailed) {
      return "bg-destructive border-destructive text-destructive-foreground";
    }
    
    switch (type) {
      case "server":
        return "bg-neon-purple border-neon-purple text-background glow-purple";
      case "peer":
        return "bg-neon-cyan border-neon-cyan text-background glow-cyan";
      case "client":
        return "bg-neon-green border-neon-green text-background glow-green";
      default:
        return "bg-muted border-border text-foreground";
    }
  };

  const getNodeSize = () => {
    return type === "server" ? "w-16 h-16" : "w-12 h-12";
  };

  const getNodeIcon = () => {
    switch (type) {
      case "server":
        return "🖥️";
      case "peer":
        return "🔗";
      case "client":
        return "💻";
      default:
        return "⚡";
    }
  };

  const getTooltipText = () => {
    switch (type) {
      case "server":
        return "Central Server - Handles all client requests and manages data distribution";
      case "peer":
        return "Peer Node - Can both send and receive data directly from other peers";
      case "client":
        return "Client Node - Sends requests to server and receives responses";
      default:
        return "Network Node";
    }
  };

  return (
    <div
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-300 hover:scale-110",
        isFailed ? "animate-pulse opacity-50" : "pulse-neon hover:animate-none",
        getNodeSize(),
        getNodeStyle()
      )}
      style={{ left: x, top: y }}
      onClick={onClick}
      title={getTooltipText()}
    >
      <span className="text-xl">{getNodeIcon()}</span>
      {isActive && (
        <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-75" />
      )}
    </div>
  );
};