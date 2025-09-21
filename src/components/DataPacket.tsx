import { cn } from "@/lib/utils";

interface DataPacketProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
  color: string;
}

export const DataPacket = ({ from, to, progress, color }: DataPacketProps) => {
  // Calculate current position based on progress
  const currentX = from.x + (to.x - from.x) * progress;
  const currentY = from.y + (to.y - from.y) * progress;

  // Calculate packet trail effect
  const trailLength = 5;
  const trailPoints = [];
  
  for (let i = 0; i < trailLength; i++) {
    const trailProgress = Math.max(0, progress - (i * 0.1));
    const trailX = from.x + (to.x - from.x) * trailProgress;
    const trailY = from.y + (to.y - from.y) * trailProgress;
    const opacity = Math.max(0, 1 - (i * 0.3));
    const scale = Math.max(0.3, 1 - (i * 0.2));
    
    trailPoints.push({
      x: trailX,
      y: trailY,
      opacity,
      scale,
    });
  }

  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case "neon-cyan":
        return "bg-neon-cyan glow-cyan";
      case "neon-green":
        return "bg-neon-green glow-green";
      case "neon-purple":
        return "bg-neon-purple glow-purple";
      case "neon-pink":
        return "bg-neon-pink border-neon-pink";
      default:
        return "bg-primary glow-cyan";
    }
  };

  if (progress <= 0 || progress >= 1) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Trail effect */}
      {trailPoints.map((point, index) => (
        <div
          key={index}
          className={cn(
            "absolute w-2 h-2 rounded-full transition-all duration-75",
            getColorClasses(color)
          )}
          style={{
            left: point.x - 4,
            top: point.y - 4,
            opacity: point.opacity,
            transform: `scale(${point.scale})`,
          }}
        />
      ))}
      
      {/* Main packet */}
      <div
        className={cn(
          "absolute w-3 h-3 rounded-full animate-pulse transition-all duration-75",
          getColorClasses(color)
        )}
        style={{
          left: currentX - 6,
          top: currentY - 6,
        }}
      >
        {/* Particle effect */}
        <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-75" />
      </div>
    </div>
  );
};