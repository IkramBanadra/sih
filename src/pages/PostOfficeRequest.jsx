import { useState } from "react";
import "./Lg.css";
import { Link, useNavigate } from "react-router-dom";
import db from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";

const INDIAN_STATES = [
  "Andhra Pradesh", 
  "Arunachal Pradesh", 
  "Assam", 
  "Bihar", 
  "Chhattisgarh", 
  "Goa", 
  "Gujarat", 
  "Haryana", 
  "Himachal Pradesh", 
  "Jharkhand", 
  "Karnataka", 
  "Kerala", 
  "Madhya Pradesh", 
  "Maharashtra", 
  "Manipur", 
  "Meghalaya", 
  "Mizoram", 
  "Nagaland", 
  "Odisha", 
  "Punjab", 
  "Rajasthan", 
  "Sikkim", 
  "Tamil Nadu", 
  "Telangana", 
  "Tripura", 
  "Uttar Pradesh", 
  "Uttarakhand", 
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

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

  const checkPincodeExists = async (pincode) => {
    const postOfficeRef = collection(db, "post_office_requests");
    const q = query(postOfficeRef, where("pincode", "==", pincode));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    const { pincode } = formData;
    const isPincodeExist = await checkPincodeExists(pincode);

    if (isPincodeExist) {
      Swal.fire({
        icon: 'warning',
        title: 'Pincode Already Exists',
        text: `The pincode ${pincode} has already been requested. Please check or try again with a different pincode.`
      });
      return;
    }

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
        <p className="signin_head">Post Office Access Request</p>
        
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
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
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