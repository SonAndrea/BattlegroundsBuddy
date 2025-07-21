import { useEffect, useState } from "react";

interface UserData {
  loggedIn: boolean;
  battleTag: string;
}

function UserPage() {
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

  if (!isLoggedIn || !userData) {
    return <h2>You are not logged in.</h2>;
  }

  if (userData) {
    return <h2>Welcome back {userData.battleTag}!</h2>;
  }
}

export default UserPage;
