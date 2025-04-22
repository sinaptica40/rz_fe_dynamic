import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const LoginPassElement = ({ areas, handlePasswordChange, password, genericError, passwordError }) => {
  const name = areas.element_data.block_name;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handlePasswordChange}
          className="form-control"
          id="password-field"
          placeholder={name}
        />
        <label htmlFor="password-field">{name}</label>
        <span
          onClick={togglePasswordVisibility}
          style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
        >
          {showPassword ? <FaEyeSlash color="orange" /> : <FaEye color="orange" />}
        </span>
      
      {passwordError && (
        <p className="text-danger">
          <small>{passwordError}</small>
        </p>
      )}
      {genericError && (
        <p className="text-danger">
          <small>{genericError}</small>
        </p>
      )}
    </>
  );
};

export default LoginPassElement;
