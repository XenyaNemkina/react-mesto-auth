import {Link, useLocation} from "react-router-dom"

function NavBar({email, onLogout}) {
  const location = useLocation();
  function handleNavToggle() {
    if (location.pathname === "/sign-in") {
      return (
        <Link to="/sign-up" className="header__link">Регистрация</Link>
      )
    } else if (location.pathname === "/sign-up") {
      return (
        <Link to="/sign-in" className="header__link">Войти</Link>
       )  
    } else {
      return (
        <>
          <p className="header__email">{email}</p>
          <button type="button" className="header__signout" onClick={onLogout}>Выйти</button>
        </>
      )
    }
  }  
  return <div className="header__navbar">{handleNavToggle()}</div>
}

export default NavBar;
