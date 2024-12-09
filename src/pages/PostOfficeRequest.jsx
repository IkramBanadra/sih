import "./Lg.css";
import { Link } from "react-router-dom";

function PostOfficeRequest() {
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
          type="text"
          name="name"
          placeholder="Name"
        />
        <input
          className="signin_form"
          type="email"
          name="email"
          placeholder="Email"
        />

        <select className="signin_form" name="state">
          <option value="" disabled selected>
            Select State
          </option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
          <option value="Assam">Assam</option>
          <option value="Bihar">Bihar</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Goa">Goa</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Haryana">Haryana</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Manipur">Manipur</option>
          <option value="Meghalaya">Meghalaya</option>
          <option value="Mizoram">Mizoram</option>
          <option value="Nagaland">Nagaland</option>
          <option value="Odisha">Odisha</option>
          <option value="Punjab">Punjab</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Sikkim">Sikkim</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Telangana">Telangana</option>
          <option value="Tripura">Tripura</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Uttarakhand">Uttarakhand</option>
          <option value="West Bengal">West Bengal</option>
        </select>

        <input
          className="signin_form"
          type="text"
          name="city"
          placeholder="City"
        />
        <input
          className="signin_form"
          type="number"
          name="pincode"
          placeholder="Pin Code"
        />

        <button type="submit" className="signinbtn">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default PostOfficeRequest;
