import React from "react";

const LandingImageElement = ({areas}) => {

    console.log("areas",areas);
    return (
        <>
            <div className="login_logoBox">
                <a href="index.html">
                    <img src={areas?.element_data?.data?.html_name} alt="" />
                </a>
            </div>
            <div className="login_image">
                <img src="img/login-image.png" alt="" />
            </div>
        </>
    )
}
export default LandingImageElement