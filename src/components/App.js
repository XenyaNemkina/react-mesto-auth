import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import ImagePopup from "./ImagePopup.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import auth from "../utils/auth.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Register from "./Register.js";
import Login from "./Login.js";
import InfoToolTip from "./InfoToolTip.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = useState([]);
  const [isEditAvatarPopupOnLoading, setEditAvatarPopupButtonText] = useState(false);
  const [isEditProfilePopupOnLoading, setEditProfilePopupButtonText] = useState(false);
  const [isAddPlacePopupOnLoading, setAddPlacePopupButtonText] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [infoMessage, setInfoMessage] = React.useState(null);
  const navigate = useNavigate();

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setInfoMessage(null);
  };

  useEffect(() => {
    isLoggedIn &&
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, data]) => {
          setCurrentUser(userData);
          setCards(data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [isLoggedIn]);

  useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    window.addEventListener("keydown", handleEscClose);
    return () => window.removeEventListener("keydown", handleEscClose);
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((i) => i._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(userData) {
    setEditProfilePopupButtonText(true);
    api
      .setUserInfo(userData)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setEditProfilePopupButtonText(false);
      });
  }

  function handleUpdateAvatar(avatar) {
    setEditAvatarPopupButtonText(true);
    api
      .editAvatar(avatar)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setEditAvatarPopupButtonText(false);
      });
  }

  function handleAddPlace(data) {
    setAddPlacePopupButtonText(true);
    api
      .addCard(data)
      .then((newCard) => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setAddPlacePopupButtonText(false);
      });
  }

  function handleShowInfoMessage(message) {
    setInfoMessage(message);
  }

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .getContent(token)
        .then((res) => {
          setEmail(res.data.email);
          handleLogin();
          navigate("/", { replace: true });
        })
        .catch((err) => console.log(err));
    }
  }, [navigate]);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
      <CurrentUserContext.Provider value={currentUser}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggiedIn={isLoggedIn}>
                <Header title="Выйти" email={email} onLogout={handleLogout} />
                <Main
                  cards={cards}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  email={email}
                  onLogout={handleLogout}
                />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<Login handleLogin={handleLogin} handleShowInfoMessage={handleShowInfoMessage} email={email} />} />
          <Route path="/sign-up" element={<Register handleShowInfoMessage={handleShowInfoMessage} />} />
          <Route path="*" element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />} />
        </Routes>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} onLoading={isEditProfilePopupOnLoading} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} onLoading={isAddPlacePopupOnLoading} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} onLoading={isEditAvatarPopupOnLoading} />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoToolTip message={infoMessage} onClose={closeAllPopups} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
