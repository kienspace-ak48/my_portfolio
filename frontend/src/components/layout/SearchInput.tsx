import { Search } from "lucide-react";
import { SEARCH_PLACEHOLDER } from "../../constants/navItems";

type SearchInputProps = {
  autoFocus?: boolean;
  className?: string;
};

const SearchInput = ({ autoFocus, className = "" }: SearchInputProps) => (
  <div className={`relative ${className}`}>
    <Search
      size={16}
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
    />
    <input
      autoFocus={autoFocus}
      type="text"
      placeholder={SEARCH_PLACEHOLDER}
      className="h-10 w-full rounded-lg border border-transparent bg-slate-100 pl-10 pr-4 text-sm placeholder:text-slate-400 transition-colors focus:border-orange-500 focus:bg-white focus:outline-none"
    />
  </div>
);

export default SearchInput;
