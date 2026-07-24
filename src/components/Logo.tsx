export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
        J
      </div>
      <span className="text-lg font-bold tracking-tight">Jhonify</span>
    </div>
  );
}
