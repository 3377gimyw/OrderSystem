import type { CartItem as CartItemType } from "../types";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#0d1a33]">
      <div className="flex-1">
        <h3 className="text-white font-medium">{item.menuItem.name}</h3>
        <p className="text-blue-400 text-sm mt-0.5">
          {formatPrice(item.menuItem.price)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
          className="bg-[#0d1a33] hover:bg-[#152444] text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
        >
          -
        </button>
        <span className="text-white font-medium w-4 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
          className="bg-blue-900 hover:bg-blue-800 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
        >
          +
        </button>
        <button
          onClick={() => removeItem(item.menuItem.id)}
          className="text-gray-500 hover:text-red-400 ml-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
