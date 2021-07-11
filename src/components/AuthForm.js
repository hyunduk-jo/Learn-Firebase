import { useState } from "react";
import { authService } from "../firebase";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        const data = await authService.createUserWithEmailAndPassword(email, password);
        console.log(data);
      } else {
        const data = await authService.signInWithEmailAndPassword(email, password);
        console.log(data);
      }
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input className="authInput" type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="authInput" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="authInput authSubmit" type="submit" value={newAccount ? "Create Account" : "Log In"} />
        <p className="authError">{error}</p>
      </form>
      <span className="authSwitch" onClick={() => setNewAccount(!newAccount)}>{newAccount ? "You have account? Login now" : "You don't have account? Create now"}</span>
    </>
  )
}