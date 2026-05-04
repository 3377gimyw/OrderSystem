import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function useTablePrefill() {
  const [params] = useSearchParams();
  const { setTableNumber } = useCart();

  useEffect(() => {
    const raw = params.get("t") ?? params.get("table");
    if (!raw) return;
    const n = parseInt(raw, 10);
    if (isNaN(n) || n < 1 || n > 30) return;
    setTableNumber(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
