import { useState } from "react";
import "./Lg.css";
import { Link, useNavigate } from "react-router-dom";
import db from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";

function PostOfficeRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    state: "",
    city: "",
    pincode: "",
    timestamp: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, email, state, city, pincode } = formData;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name || name.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Name',
        text: 'Please enter a valid name.'
      });
      return false;
    }

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.'
      });
      return false;
    }

    if (!state) {
      Swal.fire({
        icon: 'error',
        title: 'State Missing',
        text: 'Please select a state.'
      });
      return false;
    }

    if (!city || city.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Invalid City',
        text: 'Please enter a valid city.'
      });
      return false;
    }

    if (!pincode || pincode.toString().length !== 6) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Pin Code',
        text: 'Pin code must be 6 digits long.'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const postOfficeRef = collection(db, "post_office_requests");
      await addDoc(postOfficeRef, {
        ...formData,
        isAllowed: false,
        timestamp: serverTimestamp()
      });

      await Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: 'Your post office request has been received.',
        confirmButtonColor: '#3085d6',
      });

      setFormData({
        name: "",
        email: "",
        state: "",
        city: "",
        pincode: "",
        isAllowed: false,
        timestamp: null
      });

      navigate('/');
    } catch (error) {
      console.error("Error submitting post office request:", error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was a problem submitting your request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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
      <form 
        className="signin" 
        autoComplete="off" 
        onSubmit={handleSubmit}
      >
        <p className="signin_head">Post Office Login</p>
        
        <input
          className="signin_form"
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        
        <input
          className="signin_form"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        
        <select 
          className="signin_form" 
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
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
          value={formData.city}
          onChange={handleInputChange}
          required
        />
        
        <input
          className="signin_form"
          type="number"
          name="pincode"
          placeholder="Pin Code"
          value={formData.pincode}
          onChange={handleInputChange}
          required
        />
        
        <button 
          type="submit" 
          className="signinbtn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default PostOfficeRequest;