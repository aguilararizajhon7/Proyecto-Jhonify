import logoUrl from "@/assets/jhonify-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logoUrl} alt="Jhonify" className="h-8 w-8 object-contain" />
      <span className="text-lg font-bold tracking-tight">Jhonify</span>
    </div>
  );
}
