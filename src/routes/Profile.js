import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../firebase";

export default function Profile({ userObj, refreshUser }) {
  const [name, setName] = useState(userObj.displayName);
  const history = useHistory();
  const logout = () => {
    authService.signOut();
    history.push('/');
  }

  useEffect(() => {
    const getMyTwits = async () => {
      const twits = await dbService.collection("twits").where("creatorId", "==", userObj.uid).get();
      console.log(twits.docs.map(doc => doc.data()));
    }
    getMyTwits();
  }, [userObj.uid])

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== name) {
      await userObj.updateProfile({
        displayName: name
      })
      refreshUser()
    }
  }
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input type="text" placeholder="Display name" value={name} onChange={e => setName(e.target.value)} autoFocus className="formInput" />
        <input type="submit" placeholder="Upadte profile" style={{ marginTop: 10 }} className="formBtn" />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={logout}>
        Log Out
      </span>
    </div>
  )
}