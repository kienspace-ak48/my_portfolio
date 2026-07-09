import { Code2 } from "lucide-react";

type BrandIconProps = {
  size?: number;
  boxClassName?: string;
};

const BrandIcon = ({
  size = 18,
  boxClassName = "w-9 h-9 rounded-xl",
}: BrandIconProps) => (
  <span
    className={`flex shrink-0 items-center justify-center bg-orange-600 text-white ${boxClassName}`}
  >
    <Code2 size={size} strokeWidth={2.5} />
  </span>
);

export default BrandIcon;
