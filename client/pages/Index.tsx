import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, MapPin, Zap, ArrowRight, RefreshCcw, Loader2 } from "lucide-react";
import { PlatformData } from "@shared/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: platforms, isLoading, isError, refetch, isRefetching } = useQuery<PlatformData[]>({
    queryKey: ["/api/platforms"],
    queryFn: async () => {
      const response = await fetch("/api/platforms");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  const peakPlatform = platforms?.find(p => p.status === 'peak') || platforms?.[0];
  const selectedPlatform = platforms?.find(p => p.id === selectedId) || peakPlatform;

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    refetch();
  };

  const getCurrencyFormat = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Morning Shift";
    if (hour < 18) return "Afternoon Shift";
    return "Evening Rush";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing Neural Pipeline...</p>
      </div>
    );
  }

  if (isError || !platforms) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <Zap className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Telemetry Offline</h2>
        <p className="text-muted-foreground">Unable to establish connection with the GigOptimizer network.</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4">
          Attempt Re-link
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  GigOptimizer<span className="text-primary">Pro</span>
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Neural Earnings Intelligence
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">{getTimeOfDay()}</p>
              <div className="flex items-center justify-end gap-2 text-xs font-mono text-muted-foreground">
                <Clock className="h-3 w-3" />
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Top Recommendation */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-muted/30 p-1 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"></div>
          
          <div className="relative flex flex-col items-start justify-between gap-6 rounded-[calc(1rem-4px)] bg-card p-6 md:flex-row md:items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary hover:bg-primary/20">
                  <Zap className="mr-1 h-3 w-3 fill-primary" />
                  Optimal Strategy Active
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={handleRefresh}
                  disabled={isRefetching}
                >
                  <RefreshCcw className={cn("h-3 w-3", isRefetching && "animate-spin")} />
                </Button>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Highest Earnings Potential</h2>
                <p className="text-4xl font-black tracking-tight text-foreground">
                  {peakPlatform?.name}
                </p>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Projected Hourly</p>
                  <p className="text-2xl font-black text-primary">
                    {getCurrencyFormat(peakPlatform?.currentEarnings || 0)}
                  </p>
                </div>
                <div className="h-10 w-px bg-border/50 hidden sm:block"></div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Demand Level</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={cn("h-4 w-1.5 rounded-full", i <= (peakPlatform?.orders || 0) / 5 ? "bg-primary" : "bg-muted")}></div>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-foreground">High</span>
                  </div>
                </div>
              </div>
            </div>

            <Button className="group relative overflow-hidden bg-primary px-8 py-6 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0">
              <span className="relative z-10 flex items-center gap-2">
                Start Session
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
            </Button>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="mb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">Network Status</h3>
              <p className="text-sm font-medium text-muted-foreground">Real-time platform performance metrics</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {platforms.map((platform) => (
              <Card 
                key={platform.id} 
                className={cn(
                  "group cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:border-primary/50",
                  selectedPlatform?.id === platform.id ? "border-primary bg-primary/5" : "border-border/50 bg-card/50"
                )}
                onClick={() => setSelectedId(platform.id)}
              >
                <div className="relative p-6">
                  {selectedPlatform?.id === platform.id && (
                    <div className="absolute right-0 top-0 h-12 w-12 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl"></div>
                  )}
                  
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/80 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        {platform.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{platform.name}</h4>
                        <div className="flex items-center gap-1">
                          <div className={cn("h-1.5 w-1.5 rounded-full", 
                            platform.status === 'peak' ? "bg-primary animate-pulse" : 
                            platform.status === 'normal' ? "bg-secondary" : "bg-muted"
                          )}></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {platform.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={cn(
                      "font-mono font-bold",
                      platform.ratingTrend > 0 ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
                    )}>
                      {platform.ratingTrend > 0 ? "+" : ""}{platform.ratingTrend}%
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Hourly</span>
                      <span className="text-xl font-black text-foreground">{getCurrencyFormat(platform.currentEarnings)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                        <span>Reliability Score</span>
                        <span>{platform.orders * 4}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                        <div 
                          className={cn("h-full transition-all duration-1000", platform.status === 'peak' ? "bg-primary" : "bg-secondary")} 
                          style={{ width: `${platform.orders * 4}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/40 bg-card/50 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight">Zone Hotspot Analysis</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">Geographic Demand Density</CardDescription>
              </div>
              <MapPin className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Downtown Core", level: "Critical", val: 95, color: "bg-primary" },
                  { name: "Midtown Area", level: "High", val: 82, color: "bg-primary/80" },
                  { name: "Residential North", level: "Moderate", val: 45, color: "bg-secondary" },
                  { name: "Westside Hub", level: "Low", val: 28, color: "bg-muted" },
                ].map((zone) => (
                  <div key={zone.name} className="flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{zone.name}</span>
                      <span className={cn("text-[10px] font-black uppercase", 
                        zone.level === 'Critical' ? "text-primary" : "text-muted-foreground"
                      )}>{zone.level}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted/50">
                      <div className={cn("h-full", zone.color)} style={{ width: `${zone.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardHeader className="pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight">Peak Optimization</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">Scheduled Windows</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {[
                { label: "Lunch Shift", time: "11:30 AM - 1:30 PM", active: true },
                { label: "Dinner Shift", time: "6:00 PM - 8:30 PM", active: false },
                { label: "Late Night", time: "9:00 PM - 10:30 PM", active: false },
              ].map((shift) => (
                <div key={shift.label} className={cn(
                  "relative flex items-center justify-between overflow-hidden rounded-xl border p-4 transition-all",
                  shift.active ? "border-primary/50 bg-primary/5" : "border-border/40 bg-muted/10 opacity-70"
                )}>
                  {shift.active && <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>}
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-foreground">{shift.label}</p>
                    <p className="text-xs font-medium text-muted-foreground">{shift.time}</p>
                  </div>
                  {shift.active ? (
                    <Badge className="bg-primary text-[10px] font-black uppercase">Active</Badge>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border/50">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30"></div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Message */}
        <footer className="mt-12 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-3">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Neural Network Online • Data Integrity 99.9%
            </p>
          </div>
          <p className="max-w-md text-center text-xs font-medium leading-relaxed text-muted-foreground/60">
            GigOptimizerPro uses behavioral telemetry and predictive analytics to maximize your delivery yield. 
            All projections are estimates based on real-time network conditions.
          </p>
        </footer>
      </main>
    </div>
  );
}
