import { Construction } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon = ({
  title = "Coming Soon",
  description = "This section is still under construction. Check back shortly.",
}: ComingSoonProps) => {
  return (
    <div className="h-full min-h-[50vh] w-full flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-secondary/60 shadow-sm">
        <Construction className="w-6 h-6 text-description-color" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-semibold text-primary">{title}</p>
        <p className="text-[14px] text-description-color max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
