import { useEffect, useState } from "react";
import Routes from "./Routes";
import { authService } from "../firebase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    })
  }

  return (
    <>
      {init ? <Routes refreshUser={refreshUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userObj={userObj} /> : <h1>Initializing...</h1>}
      {/* <footer>&copy; {new Date().getFullYear()} FireTwit</footer> */}
    </>
  );
}

export default App;
