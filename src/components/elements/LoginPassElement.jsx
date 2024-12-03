import React from "react";

const LoginPassElement = ({areas,handlePasswordChange,password,genericError,passwordError}) => {
    const name = areas.element_data.block_name
    return (
        <>
            <input 
               type="password" 
               name="password" 
               value={password} 
               onChange={handlePasswordChange} 
               className="form-control" 
               id="password-field" 
               //placeholder="Password" 
               placeholder={name}
               />
            <label htmlFor="password-field">{name}</label>
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
            
            {/* <span toggle="#password-field" className="fa fa-fw fa-eye pass-icon toggle-password" /> */}
        </>
    )
}
export default LoginPassElement