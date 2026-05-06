import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MenuPage from "./components/MenuPage";
import Cart from "./components/Cart";
import OrderForm from "./components/OrderForm";
import OrderConfirmation from "./components/OrderConfirmation";
import OrderHistoryPage from "./components/OrderHistoryPage";
import StaffPage from "./components/StaffPage";
import { useTablePrefill } from "./hooks/useTablePrefill";

export default function App() {
  useTablePrefill();
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />
          <Route path="/history" element={<OrderHistoryPage />} />
          <Route path="/staff" element={<StaffPage />} />
        </Routes>
      </main>
    </div>
  );
}
