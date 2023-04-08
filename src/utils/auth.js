class Auth {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _getResponseData(res) {
    return res.json().then((res) => {
      throw new Error(res.message);
    });
  }

  register({ email, password }) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((response) => {
      if (response.ok) return response.json();
      return this._getResponseData(response);
    });
  }

  authorization({ email, password }) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((response) => {
      if (response.ok) return response.json();
      return this._getResponseData(response);
    });
  }

  getContent(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data);
  }
}

const auth = new Auth({
  baseUrl: "https://auth.nomoreparties.co",
});

export default auth;
