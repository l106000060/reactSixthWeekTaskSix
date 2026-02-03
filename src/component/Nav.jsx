import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-gray-400 mb-4">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
              <li className="nav-item nav-link">Focus Fitness</li>
              <li className="nav-item ">
                <NavLink className="nav-link " to="/">
                  首頁
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/products">
                  商城
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/cart">
                  購物車
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/Login">
                  登入
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
