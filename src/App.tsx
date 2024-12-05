import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import Home from "./pages/home";
import TopUpPage from "./pages/top-up";
import TransactionPage from "./pages/transaction";
import PaymentPage from "./pages/payment";
import LogoutPage from "./pages/logout";
import ProfilePage from "./pages/profile";

const App = () => {
  return (
   
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/top-up" element={<TopUpPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
