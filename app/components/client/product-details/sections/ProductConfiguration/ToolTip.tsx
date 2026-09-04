function ShapePreview({ shape }: { shape: string }) {
  switch (shape) {
    case "round":
      return (
        <div className="w-8 h-8 rounded-full border-[1.5px] border-white" />
      );
    case "square":
      return <div className="w-8 h-8 border-[1.5px] border-white" />;
    case "round-thick":
      return <div className="w-8 h-8 rounded-full border-4 border-white" />;
    case "square-thick":
      return <div className="w-8 h-8 border-4 border-white" />;
    case "circle-dot":
      return (
        <div className="relative w-[30px] h-[30px] rounded-full border-[1.5px] border-white">
          <div className="absolute inset-[5px] rounded-full bg-white" />
        </div>
      );
    case "trimless":
      return <div className="w-10 h-2 rounded-[1px] bg-white" />;
    case "trim":
      return <div className="w-10 h-4 border-[3px] border-white" />;
    default:
      return null;
  }
}

function SizePreview({
  sizeBox,
}: {
  sizeBox: { width: number; height: number };
}) {
  const x = (70 - sizeBox.width) / 2;
  const y = (50 - sizeBox.height) / 2;
  return (
    <svg viewBox="0 0 70 50" width={70} height={50}>
      <rect
        x={x}
        y={y}
        width={sizeBox.width}
        height={sizeBox.height}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function BeamPreview({ beamAngle }: { beamAngle: number }) {
  const apexX = 35;
  const apexY = 12;
  const baseY = 46;
  const halfWidth =
    (baseY - apexY) * Math.tan((beamAngle / 2) * (Math.PI / 180));
  const left = apexX - halfWidth;
  const right = apexX + halfWidth;

  return (
    <svg viewBox="0 0 70 50" width={70} height={50}>
      <circle cx={apexX} cy={10} r={2} fill="#FFFFFF" />
      <polygon
        points={`${apexX},${apexY} ${left},${baseY} ${right},${baseY}`}
        stroke="#FFFFFF"
        strokeWidth={0.8}
        fill="rgba(255,255,255,0.18)"
      />
    </svg>
  );
}

function SwatchPreview({
  color,
  gradient,
}: {
  color?: string;
  gradient?: string;
}) {
  return (
    <div
      className="w-8 h-8 border border-white/20"
      style={{ background: gradient ?? color ?? "#FFFFFF" }}
    />
  );
}

function GradientPreview({ gradient }: { gradient: string }) {
  return <div className="w-full h-full" style={{ background: gradient }} />;
}

export default function TooltipPreview({ preview }: { preview: any }) {
  if (preview.type === "none") return null;

  return (
    <div className="w-[80px] h-[56px] shrink-0 flex items-center justify-center rounded-[2px] bg-[#161618] border border-[#2A2A2A] overflow-hidden">
      {preview.type === "shape" && preview.shape && (
        <ShapePreview shape={preview.shape} />
      )}
      {preview.type === "swatch" && (
        <SwatchPreview color={preview.color} gradient={preview.gradient} />
      )}
      {preview.type === "size" && preview.sizeBox && (
        <SizePreview sizeBox={preview.sizeBox} />
      )}
      {preview.type === "beam" && typeof preview.beamAngle === "number" && (
        <BeamPreview beamAngle={preview.beamAngle} />
      )}
      {preview.type === "gradient" && preview.gradient && (
        <GradientPreview gradient={preview.gradient} />
      )}
    </div>
  );
}