import { useState, useCallback, useEffect } from "react";
import { NetworkNode } from "./NetworkNode";
import { DataPacket } from "./DataPacket";
import { MetricsPanel } from "./MetricsPanel";
import { ControlPanel } from "./ControlPanel";
import { Card } from "@/components/ui/card";

export interface NodeData {
  id: string;
  x: number;
  y: number;
  type: "client" | "server" | "peer";
  isActive: boolean;
  isFailed: boolean;
}

export interface PacketData {
  id: string;
  from: string;
  to: string;
  progress: number;
  color: string;
}

export interface NetworkMetrics {
  latency: number;
  throughput: number;
  reliability: number;
  load: number;
}

const NetworkSimulation = () => {
  const [isFailureMode, setIsFailureMode] = useState(false);
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [metrics, setMetrics] = useState({
    p2p: { latency: 45, throughput: 78, reliability: 92, load: 23 },
    clientServer: { latency: 120, throughput: 95, reliability: 98, load: 67 }
  });

  // P2P Network nodes
  const p2pNodes: NodeData[] = [
    { id: "p2p-1", x: 150, y: 100, type: "peer", isActive: false, isFailed: false },
    { id: "p2p-2", x: 300, y: 80, type: "peer", isActive: false, isFailed: false },
    { id: "p2p-3", x: 250, y: 200, type: "peer", isActive: false, isFailed: false },
    { id: "p2p-4", x: 100, y: 220, type: "peer", isActive: false, isFailed: false },
    { id: "p2p-5", x: 350, y: 180, type: "peer", isActive: false, isFailed: false },
  ];

  // Client-Server Network nodes
  const clientServerNodes: NodeData[] = [
    { id: "server", x: 200, y: 100, type: "server", isActive: false, isFailed: isFailureMode },
    { id: "client-1", x: 80, y: 200, type: "client", isActive: false, isFailed: false },
    { id: "client-2", x: 150, y: 250, type: "client", isActive: false, isFailed: false },
    { id: "client-3", x: 250, y: 250, type: "client", isActive: false, isFailed: false },
    { id: "client-4", x: 320, y: 200, type: "client", isActive: false, isFailed: false },
  ];

  const sendPacket = useCallback((fromId: string, toId: string, networkType: "p2p" | "clientServer") => {
    const packetId = `${fromId}-${toId}-${Date.now()}`;
    const colors = ["neon-cyan", "neon-green", "neon-purple", "neon-pink"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newPacket: PacketData = {
      id: packetId,
      from: fromId,
      to: toId,
      progress: 0,
      color
    };

    setPackets(prev => [...prev, newPacket]);

    // Animate packet progress
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setPackets(prev => 
        prev.map(p => p.id === packetId ? { ...p, progress } : p)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Remove packet after completion
        setTimeout(() => {
          setPackets(prev => prev.filter(p => p.id !== packetId));
        }, 200);
      }
    };

    requestAnimationFrame(animate);

    // Update metrics based on network type and failure mode
    if (networkType === "p2p") {
      setMetrics(prev => ({
        ...prev,
        p2p: {
          ...prev.p2p,
          latency: isFailureMode ? prev.p2p.latency + 20 : Math.max(30, prev.p2p.latency - 5),
          throughput: Math.min(100, prev.p2p.throughput + 2),
          load: Math.min(100, prev.p2p.load + 10)
        }
      }));
    } else {
      setMetrics(prev => ({
        ...prev,
        clientServer: {
          ...prev.clientServer,
          latency: isFailureMode ? 999 : Math.max(80, prev.clientServer.latency - 10),
          reliability: isFailureMode ? 0 : Math.min(100, prev.clientServer.reliability + 1),
          load: Math.min(100, prev.clientServer.load + 15)
        }
      }));
    }
  }, [isFailureMode]);

  const handleNodeClick = useCallback((nodeId: string, networkType: "p2p" | "clientServer") => {
    if (networkType === "p2p") {
      // In P2P, send to random peers
      const availablePeers = p2pNodes.filter(n => n.id !== nodeId && !(isFailureMode && n.id === "p2p-3"));
      if (availablePeers.length > 0) {
        const randomPeer = availablePeers[Math.floor(Math.random() * availablePeers.length)];
        sendPacket(nodeId, randomPeer.id, "p2p");
      }
    } else {
      // In Client-Server, clients send to server, server broadcasts
      if (nodeId === "server" && !isFailureMode) {
        // Server broadcasts to all clients
        clientServerNodes.filter(n => n.type === "client").forEach(client => {
          sendPacket("server", client.id, "clientServer");
        });
      } else if (nodeId !== "server") {
        // Client sends to server
        if (!isFailureMode) {
          sendPacket(nodeId, "server", "clientServer");
        }
      }
    }
  }, [sendPacket, isFailureMode]);

  // Simulate automatic network activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // Random P2P activity
        const randomNode = p2pNodes[Math.floor(Math.random() * p2pNodes.length)];
        if (!(isFailureMode && randomNode.id === "p2p-3")) {
          handleNodeClick(randomNode.id, "p2p");
        }
      }
      
      if (Math.random() > 0.8 && !isFailureMode) {
        // Random Client-Server activity
        const randomClient = clientServerNodes.filter(n => n.type === "client")[Math.floor(Math.random() * 4)];
        handleNodeClick(randomClient.id, "clientServer");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [handleNodeClick, isFailureMode]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green bg-clip-text text-transparent">
            Network Architecture Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive visualization of Peer-to-Peer vs Client-Server network architectures. 
            Click nodes to send data and toggle failure modes to see how each architecture responds.
          </p>
        </div>

        {/* Control Panel */}
        <ControlPanel 
          isFailureMode={isFailureMode}
          onFailureModeToggle={setIsFailureMode}
        />

        {/* Network Diagrams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* P2P Network */}
          <Card className="relative p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="absolute inset-0 network-grid rounded-lg" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-neon-cyan text-glow-cyan mb-6 text-center">
                Peer-to-Peer Network
              </h2>
              <div className="relative h-80 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Connection lines */}
                  {p2pNodes.map((node, i) => 
                    p2pNodes.slice(i + 1).map(otherNode => (
                      <line
                        key={`${node.id}-${otherNode.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={otherNode.x}
                        y2={otherNode.y}
                        stroke="hsl(var(--neon-cyan))"
                        strokeWidth="1"
                        opacity={isFailureMode && (node.id === "p2p-3" || otherNode.id === "p2p-3") ? "0.2" : "0.6"}
                        className="transition-opacity duration-300"
                      />
                    ))
                  )}
                </svg>
                
                {/* Nodes */}
                {p2pNodes.map(node => (
                  <NetworkNode
                    key={node.id}
                    {...node}
                    isFailed={isFailureMode && node.id === "p2p-3"}
                    onClick={() => handleNodeClick(node.id, "p2p")}
                  />
                ))}

                {/* Data Packets */}
                {packets.filter(p => p.from.startsWith("p2p") || p.to.startsWith("p2p")).map(packet => {
                  const fromNode = p2pNodes.find(n => n.id === packet.from);
                  const toNode = p2pNodes.find(n => n.id === packet.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <DataPacket
                      key={packet.id}
                      from={{ x: fromNode.x, y: fromNode.y }}
                      to={{ x: toNode.x, y: toNode.y }}
                      progress={packet.progress}
                      color={packet.color}
                    />
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Client-Server Network */}
          <Card className="relative p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="absolute inset-0 network-grid rounded-lg" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-neon-purple text-glow-purple mb-6 text-center">
                Client-Server Network
              </h2>
              <div className="relative h-80 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Connection lines from server to clients */}
                  {clientServerNodes.filter(n => n.type === "client").map(client => {
                    const server = clientServerNodes.find(n => n.type === "server")!;
                    return (
                      <line
                        key={`server-${client.id}`}
                        x1={server.x}
                        y1={server.y}
                        x2={client.x}
                        y2={client.y}
                        stroke="hsl(var(--neon-purple))"
                        strokeWidth="2"
                        opacity={isFailureMode ? "0.2" : "0.8"}
                        className="transition-opacity duration-300"
                      />
                    );
                  })}
                </svg>
                
                {/* Nodes */}
                {clientServerNodes.map(node => (
                  <NetworkNode
                    key={node.id}
                    {...node}
                    onClick={() => handleNodeClick(node.id, "clientServer")}
                  />
                ))}

                {/* Data Packets */}
                {packets.filter(p => p.from === "server" || p.to === "server" || p.from.startsWith("client")).map(packet => {
                  const fromNode = clientServerNodes.find(n => n.id === packet.from);
                  const toNode = clientServerNodes.find(n => n.id === packet.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <DataPacket
                      key={packet.id}
                      from={{ x: fromNode.x, y: fromNode.y }}
                      to={{ x: toNode.x, y: toNode.y }}
                      progress={packet.progress}
                      color={packet.color}
                    />
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Metrics Panel */}
        <MetricsPanel 
          p2pMetrics={metrics.p2p}
          clientServerMetrics={metrics.clientServer}
          isFailureMode={isFailureMode}
        />
      </div>
    </div>
  );
};

export default NetworkSimulation;