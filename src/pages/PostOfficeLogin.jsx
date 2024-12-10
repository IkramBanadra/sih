import "./Lg.css";
import { Link } from "react-router-dom";

function PostOfficeLogin() {
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
      <form className="signin" autoComplete="off">
        <p className="signin_head">Post Office Login</p>
        
        <input
          className="signin_form"
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="signin_form"
        />
        
        <button type="submit" className="signinbtn">
          Sign Up
        </button>
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

export default PostOfficeLogin;
