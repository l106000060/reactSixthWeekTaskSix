import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./component/Nav";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";

function Router() {
  return (
    <>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route
            path="/products/:urlProductId"
            element={<ProductDetails />}
          ></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/Login" element={<Login />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default Router;
