import logoAsset from "@/assets/jhonify-logo.png.asset.json";

export function Logo({
  className = "",
  size = "sm",
  showText = true,
}: {
  className?: string;
  size?: "sm" | "lg";
  showText?: boolean;
}) {
  if (size === "lg") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <img
          src={logoAsset.url}
          alt="Jhonify"
          className="h-40 w-40 object-contain sm:h-48 sm:w-48"
        />
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logoAsset.url} alt="Jhonify" className="h-9 w-9 object-contain" />
      {showText && <span className="text-lg font-bold tracking-tight">Jhonify</span>}
    </div>
  );
}
