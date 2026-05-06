import { Link } from "react-router-dom";
import { menuItems } from "../data/menu";
import { useCart } from "../context/CartContext";
import type { MenuItem, MenuCategory } from "../types";

const CATEGORIES: MenuCategory[] = ["안주", "식사"];

function PriceText({ value }: { value: number }) {
  return (
    <span className="tabular-nums">
      <span className="font-serif font-normal">{value.toLocaleString("ko-KR")}</span>
      <span className="font-sans text-ash text-[0.72em] ml-[3px]">원</span>
    </span>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((ci) => ci.menuItem.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  if (item.soldOut) {
    return (
      <li className="flex items-baseline justify-between gap-6 px-6 py-5 min-h-[60px]">
        <span className="font-sans text-[17px] text-ash">{item.name}</span>
        <span className="font-sans text-[11px] tracking-[0.18em] text-ash uppercase">
          품절
        </span>
      </li>
    );
  }

  if (quantity === 0) {
    return (
      <li>
        <button
          type="button"
          onClick={() => addItem(item)}
          aria-label={`${item.name} 담기`}
          className="w-full flex items-baseline justify-between gap-6 px-6 py-5 min-h-[60px] text-left transition-colors duration-200 active:bg-smoke/40 select-none touch-manipulation"
        >
          <span className="font-sans text-[17px] font-medium text-bone">{item.name}</span>
          <span className="text-[16px] text-bone">
            <PriceText value={item.price} />
          </span>
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 px-6 py-3 min-h-[60px]">
      <span className="font-sans text-[17px] font-medium text-bone">{item.name}</span>
      <div className="flex items-center -mr-3">
        <button
          type="button"
          onClick={() => updateQuantity(item.id, quantity - 1)}
          aria-label={`${item.name} 수량 감소`}
          className="w-11 h-11 flex items-center justify-center text-[20px] leading-none text-ash hover:text-bone active:text-bone transition-colors duration-150 select-none touch-manipulation"
        >
          −
        </button>
        <span className="font-serif font-normal text-[19px] text-bone tabular-nums w-6 text-center">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(item.id, quantity + 1)}
          aria-label={`${item.name} 수량 증가`}
          className="w-11 h-11 flex items-center justify-center text-[20px] leading-none text-ash hover:text-bone active:text-bone transition-colors duration-150 select-none touch-manipulation"
        >
          +
        </button>
      </div>
    </li>
  );
}

export default function MenuPage() {
  const { totalItems, totalPrice, tableNumber } = useCart();

  return (
    <div className="pt-12 pb-12">
      {tableNumber !== null && (
        <div className="px-6 pb-2">
          <span className="font-serif font-normal text-[14px] text-bone tracking-[0.04em]">
            테이블 {tableNumber}
          </span>
        </div>
      )}

      {CATEGORIES.map((category, index) => {
        const categoryItems = menuItems.filter((m) => m.category === category);
        if (categoryItems.length === 0) return null;
        return (
          <section
            key={category}
            className={index === 0 ? "pt-12" : "pt-20"}
            aria-labelledby={`cat-${category}`}
          >
            <h2
              id={`cat-${category}`}
              className="font-serif font-light text-[28px] text-bone px-6 pb-3 tracking-[0.02em]"
            >
              {category}
            </h2>
            <ul className="flex flex-col">
              {categoryItems.map((item) => (
                <MenuRow key={item.id} item={item} />
              ))}
            </ul>
          </section>
        );
      })}

      {totalItems > 0 && (
        <div className="pt-20 px-6">
          <Link
            to="/cart"
            className="inline-flex items-baseline gap-3 py-3 -mx-3 px-3 transition-colors duration-200 active:bg-smoke/40 select-none touch-manipulation"
            aria-label={`장바구니 ${totalItems}개, ${totalPrice.toLocaleString("ko-KR")}원`}
          >
            <span className="font-sans text-[12px] tracking-[0.18em] text-ash uppercase">
              장바구니
            </span>
            <span className="font-sans text-ash text-[14px]" aria-hidden>·</span>
            <span className="font-serif font-normal text-[18px] text-night-blue tabular-nums">
              {totalItems}
            </span>
            <span className="font-sans text-ash text-[14px]" aria-hidden>·</span>
            <span className="text-[18px] text-night-blue">
              <span className="tabular-nums font-serif font-normal">
                {totalPrice.toLocaleString("ko-KR")}
              </span>
              <span className="font-sans text-ash text-[12px] ml-[3px]">원</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
