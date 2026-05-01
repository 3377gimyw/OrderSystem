import type { MenuCategory } from "../types";

const categories: MenuCategory[] = ["주류", "안주", "식사", "음료"];

interface CategoryTabsProps {
  selected: MenuCategory | null;
  onSelect: (category: MenuCategory | null) => void;
}

export default function CategoryTabs({
  selected,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? "bg-blue-900 text-white"
            : "bg-[#080f1e] text-gray-400 hover:text-white"
        }`}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === category
              ? "bg-blue-900 text-white"
              : "bg-[#080f1e] text-gray-400 hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
