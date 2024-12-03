import React from "react";

const LoginEmailElement =(props)=>{
    let {
      areas,handleEmailChange,
      email,genericError,
      handleEmailBlur,
      emailError }=props;
    const name = areas.element_data.block_name
    return(
        <>
            <input 
            type="email" 
            value ={email} 
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className="form-control" 
            id="Email" 
            ////placeholder="Email" 
            placeholder={name}
            />

            <label htmlFor="Email">{name}</label>
            {emailError && (
           <p className="text-danger">
             <small>{emailError}</small>
           </p>
         )}
         
        {genericError && (
          <p className="text-danger">
            <small>{genericError}</small>
          </p>
        )}
        </>
    )
}
export default LoginEmailElement