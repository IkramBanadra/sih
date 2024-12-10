import "./Lg.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../firebaseConfig";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authenticatedUser"));
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const usersRef = collection(db, "admin");
      const q = query(
        usersRef,
        where("email", "==", email),
        where("pass", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        localStorage.setItem(
          "authenticatedUser", 
          JSON.stringify({ 
            email, 
            role: "admin" 
          })
        );
        navigate("/adminSwachataDashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="sn_flex">
      <div>
        <Link to="/">
          <h2 className="lg_head">Home</h2>
        </Link>
        <img
          alt="gaming_img"
          src="https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          className="gameimg"
        />
      </div>
      <form className="signin" autoComplete="off" onSubmit={handleLogin}>
        <p className="signin_head">Admin Login</p>
        <input
          className="signin_form"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="signin_form"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="signinbtn">
          Sign In
        </button>
        {error && <p className="error">{error}</p>}
        <p className="noacc_signin">
          Do Not Have an account?{" "}
          <Link to={"/accessReq"}>
            <strong>Request Access</strong>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;