import React from "react";

const LoginLayout = ({ areas }) => {
   
    const findAreaByKeyPrefix = (prefix) => areas.find(area => area.key && area.key.startsWith(prefix));
    return (
        <>
            <div className="loader-wrapper" style={{ display: "none" }}>
                <div className="loader">
                    <img src="img/logo.png" alt="" />
                </div>
            </div>
            {/* loader  */}
            <div className="loader-wrapper" style={{ display: "none" }}>
                <div className="loader">
                    <img src="img/mobile-logo.png" alt="" />
                </div>
            </div>
            {/* main */}
            <section className="login_wrapper">
                <div className="login_contentBox">
                    <div class="yellow-bg"></div>
                    <div class="container-fluid h-100 p-0">
                        <div class="row h-100 align-items-center">
                            {findAreaByKeyPrefix('LoginLeftArea')}
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="login_sign_up_block">
                                    {findAreaByKeyPrefix('LoginTextArea')}
                                    <div className="Login_InputBox">
                                        {findAreaByKeyPrefix('LoginEmailArea')}
                                        {findAreaByKeyPrefix('LoginPassArea')}
                                    </div>
                                    <div className="forgot_terms">
                                        <div>
                                            <div className="form-custom-check">
                                                {findAreaByKeyPrefix('LoginCheckArea')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="login_button">
                                        {findAreaByKeyPrefix('LoginButtonArea')}
                                        {findAreaByKeyPrefix('LoginForgetArea')}
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LoginLayout