import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header.js";
import auth from "../utils/auth.js";

const Login = ({ handleLogin, email, handleShowInfoMessage }) => {
  const [formValue, setFormValue] = React.useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    auth
      .authorization(formValue)
      .then((data) => {
        if (data.token) localStorage.setItem("token", data.token);
        setFormValue({ email: "", password: "" });
        handleLogin();
        navigate("/", { replace: true });
      })
      .catch((err) => {
        handleShowInfoMessage({
          text: err.message || "Что-то пошло не так! Попробуйте еще раз.",
          isSuccess: false,
        });
      });
  };

  return (
    <>
      <Header>
        <Link to="/sign-in" className="header__link">
          Войти
        </Link>
      </Header>
      <main className="content">
        <section className="auth">
          <div className="auth__container">
            <h2 className="auth__title">Вход</h2>
            <form className="auth__form" onSubmit={handleSubmit}>
              <input className="popup__field auth__field" type="email" name="email" placeholder="Email" minLength="2" autoComplete="off" value={formValue.email} onChange={handleChange} required />
              <span className="popup__error popup__error_active"></span>
              <input className="popup__field auth__field" type="password" name="password" placeholder="Пароль" minLength="2" autoComplete="off" value={formValue.password} onChange={handleChange} required />
              <span className="popup__error popup__error_active"></span>
              <button type="submit" onSubmit={handleSubmit} className="popup__save popup__save_auth-button">
                Войти
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};
export default Login;
