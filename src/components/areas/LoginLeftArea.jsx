import React from "react";

const LoginLeftArea =({children})=>{
    return(
        <>
            <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="login_leftSlide">
                {children}
                </div>
            </div>
        </>
    )
}

export default LoginLeftArea;