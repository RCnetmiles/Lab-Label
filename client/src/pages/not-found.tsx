import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground font-mono">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4 animate-pulse" />
      <h1 className="text-4xl font-display font-bold tracking-wider mb-2">404 ERROR</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The requested resource has been purged from the archives or does not exist.
      </p>
      
      <Link href="/" className="px-6 py-3 border border-primary text-primary hover:bg-primary/10 transition-colors uppercase tracking-widest text-sm font-bold">
        Return to Dashboard
      </Link>
    </div>
  );
}
