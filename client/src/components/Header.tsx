import "./Header.css";
import { useEffect, useState } from "react";

interface UserData {
  loggedIn: boolean;
  battleTag: string;
}

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/user", {
      credentials: "include",
    })
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.loggedIn) {
          setIsLoggedIn(true);
          setUserData(data);
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
      <>
        <button type="button" className={"btn btn-dark"} onClick={handleClick}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </>
    </header>
  );
}

export default Header;
