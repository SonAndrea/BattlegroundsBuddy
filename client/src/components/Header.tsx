import "./Header.css";
import { useEffect, useState } from "react";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/user", {
      credentials: "include",
    })
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.loggedIn) {
          setIsLoggedIn(true);
        }
      });
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      fetch("http://localhost:4000/logout", {
        credentials: "include",
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      window.location.href = "http://localhost:4000/oauth";
    }
  };

  return (
    <header className="app-header">
      <h1>Battlegrounds Buddy</h1>
      <button type="button" id="logout-button" onClick={handleClick}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>
    </header>
  );
}

export default Header;
