import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ControlPanelProps {
  isFailureMode: boolean;
  onFailureModeToggle: (enabled: boolean) => void;
}

export const ControlPanel = ({ isFailureMode, onFailureModeToggle }: ControlPanelProps) => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="failure-mode" 
              checked={isFailureMode}
              onCheckedChange={onFailureModeToggle}
            />
            <Label htmlFor="failure-mode" className="text-sm font-medium">
              Failure Mode
            </Label>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {isFailureMode ? (
              <span className="text-destructive font-medium">
                🚨 Simulating network failures
              </span>
            ) : (
              <span className="text-neon-green">
                ✅ Normal operation
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-cyan glow-cyan"></div>
            <span>Click nodes to send data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-purple glow-purple"></div>
            <span>Watch automatic traffic</span>
          </div>
        </div>
      </div>

      {isFailureMode && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-destructive">⚠️</span>
            <div className="text-sm">
              <p className="font-medium text-destructive mb-1">Failure Scenarios Active:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• P2P: One peer (node 3) has disconnected</li>
                <li>• Client-Server: Central server is down</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};