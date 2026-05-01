import type { MenuItem } from "../types";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((ci) => ci.menuItem.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div
      className={`bg-[#080f1e] rounded-xl border border-[#0d1a33] overflow-hidden ${
        item.soldOut ? "opacity-50" : ""
      }`}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-white font-medium">{item.name}</h3>
            {item.nameEn && (
              <p className="text-gray-400 text-sm">{item.nameEn}</p>
            )}
          </div>
          {item.soldOut && (
            <span className="shrink-0 bg-red-900/50 text-red-400 text-xs font-bold px-2 py-1 rounded">
              품절
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-gray-400 text-sm mt-1">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-blue-400 font-bold">
            {formatPrice(item.price)}
          </span>
          {item.soldOut ? null : quantity === 0 ? (
            <button
              onClick={() => addItem(item)}
              className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors active:scale-95"
            >
              담기
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="bg-[#0d1a33] hover:bg-[#152444] text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-white font-medium w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="bg-blue-900 hover:bg-blue-800 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
