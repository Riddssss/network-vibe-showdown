import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NetworkMetrics } from "./NetworkSimulation";

interface MetricsPanelProps {
  p2pMetrics: NetworkMetrics;
  clientServerMetrics: NetworkMetrics;
  isFailureMode: boolean;
}

export const MetricsPanel = ({ p2pMetrics, clientServerMetrics, isFailureMode }: MetricsPanelProps) => {
  const MetricItem = ({ 
    label, 
    value, 
    unit, 
    color, 
    description 
  }: { 
    label: string; 
    value: number; 
    unit: string; 
    color: string; 
    description: string; 
  }) => (
    <div className="space-y-2" title={description}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`text-sm font-bold text-${color}`}>
          {value}{unit}
        </span>
      </div>
      <Progress 
        value={value} 
        className="h-2"
        style={{
          background: `hsl(var(--muted))`,
        }}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* P2P Metrics */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-neon-cyan text-glow-cyan flex items-center gap-2">
            🔗 P2P Network Metrics
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricItem
              label="Latency"
              value={p2pMetrics.latency}
              unit="ms"
              color="neon-cyan"
              description="Average time for data to travel between peers"
            />
            <MetricItem
              label="Throughput"
              value={p2pMetrics.throughput}
              unit="%"
              color="neon-green"
              description="Network capacity utilization"
            />
            <MetricItem
              label="Reliability"
              value={p2pMetrics.reliability}
              unit="%"
              color="neon-purple"
              description="Success rate of data transmission"
            />
            <MetricItem
              label="Load Distribution"
              value={p2pMetrics.load}
              unit="%"
              color="neon-pink"
              description="How evenly load is distributed across peers"
            />
          </div>

          <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-neon-cyan/20">
            <h4 className="font-semibold text-neon-cyan mb-2">P2P Advantages:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Decentralized - no single point of failure</li>
              <li>• Scalable - performance improves with more peers</li>
              <li>• Cost-effective - shared resources</li>
              {isFailureMode && <li className="text-neon-green">• Resilient to individual node failures</li>}
            </ul>
          </div>
        </div>
      </Card>

      {/* Client-Server Metrics */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-neon-purple text-glow-purple flex items-center gap-2">
            🖥️ Client-Server Metrics
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricItem
              label="Latency"
              value={isFailureMode ? 999 : clientServerMetrics.latency}
              unit="ms"
              color={isFailureMode ? "destructive" : "neon-cyan"}
              description="Time for client requests to reach server and return"
            />
            <MetricItem
              label="Throughput"
              value={isFailureMode ? 0 : clientServerMetrics.throughput}
              unit="%"
              color={isFailureMode ? "destructive" : "neon-green"}
              description="Server processing capacity utilization"
            />
            <MetricItem
              label="Reliability"
              value={isFailureMode ? 0 : clientServerMetrics.reliability}
              unit="%"
              color={isFailureMode ? "destructive" : "neon-purple"}
              description="Server uptime and successful request rate"
            />
            <MetricItem
              label="Server Load"
              value={isFailureMode ? 100 : clientServerMetrics.load}
              unit="%"
              color={isFailureMode ? "destructive" : "neon-pink"}
              description="Current server resource utilization"
            />
          </div>

          <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-neon-purple/20">
            <h4 className="font-semibold text-neon-purple mb-2">Client-Server Advantages:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Centralized control and security</li>
              <li>• Consistent data management</li>
              <li>• Easier maintenance and updates</li>
              {isFailureMode && <li className="text-destructive">• Vulnerable to server failures</li>}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};