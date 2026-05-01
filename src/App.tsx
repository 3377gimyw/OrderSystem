import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MenuPage from "./components/MenuPage";
import Cart from "./components/Cart";
import OrderForm from "./components/OrderForm";
import OrderConfirmation from "./components/OrderConfirmation";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
    </div>
  );
}
