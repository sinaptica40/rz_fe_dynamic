import React, { useState } from "react";
import { useLoginMutation } from "../../services/apiSlice";
import { isTokenExpired } from "../../utils/helper";
import { useLocation, useNavigate } from "react-router-dom";

const LoginLayout = ({ areas }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login] = useLoginMutation();
  const [genericError, setGenericError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const route = location.pathname.substring(1) || '/';

  let getApi = areas.filter((item) => item?.props?.children?.props?.children?.props?.api != null
  ).reduce((acc, user) => {
    const key = user?.key;
    const functionName = user.props.children.props.children.props.api.function_name;
    const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

    if (key?.includes("LoginButtonArea")) {
      acc.loginApiUrl = functionName;
      acc.loginApi_Method = api_Method;
    }

    return acc;
  }, {})

  const handleEmailBlur = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
    const area = areas.find(area => area.key && area.key.startsWith(prefix));
    if (area) {
      const deepCloneChildren = (children, extraProps) => {
        return React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const clonedChild = React.cloneElement(child, { ...extraProps });
            if (child.props && child.props.children) {
              const updatedChildren = deepCloneChildren(child.props.children, extraProps);
              return React.cloneElement(clonedChild, { children: updatedChildren });
            }
            return clonedChild;
          }
          return child;
        });
      };

      const clonedArea = React.cloneElement(area, {
        ...extraProps,
        children: deepCloneChildren(area.props.children, extraProps),
      });
      return clonedArea;
    }
    return null;
  };

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    return valid;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    console.log("e.target.value", e.target.value)
    setPassword(e.target.value)
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let genericErrorMessage = "";
    try {
      if (validateForm()) {
        if (getApi) {
          const credentials = {
            url: getApi?.loginApiUrl,
            method: getApi?.loginApi_Method,
            data: {
              email: email,
              password: password,
            }
          };

          const response = await login(credentials);
          console.log(response?.data?.data?.naviagate, "response")

          if (response.data.status !== "SUCCESS") {
            if (typeof response.data.message === "object") {
              setEmailError(response.data.message.email || "");
              setPasswordError(response.data.message.password || "");
            } else {

              genericErrorMessage = response.data.message;
            }
          } else {
            if (
              response?.data?.data?.access_token &&
              response?.data?.data?.access_token !== "undefined"
            ) {
              if (rememberMe) {
                console.log("response?.data?.data?.access_token", response?.data?.data?.access_token)
                sessionStorage.setItem("email", email.toString());
                sessionStorage.setItem("password", password.toString());
              } else {
                sessionStorage.removeItem("email");
                sessionStorage.removeItem("password");
              }

              localStorage.setItem("access_token", response?.data?.data?.access_token);
              localStorage.setItem("user_name", response?.data?.data?.user?.name);
              localStorage.setItem("user_id", response?.data?.data?.user?.id);



              if (response?.data?.data?.access_token) {
                if (isTokenExpired(response?.data?.data?.access_token)) {
                  localStorage.removeItem('access_token');
                  navigate(`/${route}`);
                } else {
                  navigate(`/${response?.data?.data?.navigate}`);

                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }

    if (genericErrorMessage) {
      setGenericError(genericErrorMessage);
    }
  };

  return (
    <>
      <div className="loader-wrapper" style={{ display: "none" }}>
        <div className="loader">
          <img src="img/logo.png" alt="" />
        </div>
      </div>
      <div className="loader-wrapper" style={{ display: "none" }}>
        <div className="loader">
          <img src="img/mobile-logo.png" alt="" />
        </div>
      </div>
      <section className="login_wrapper">
        <div className="login_contentBox">
          <div className="yellow-bg"></div>
          <div className="container-fluid h-100 p-0">
            <form onSubmit={handleSubmit}>
              <div className="row h-100 align-items-center">
                {findAreaByKeyPrefix('LoginLeftArea')}
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="login_sign_up_block">
                    {findAreaByKeyPrefix('LoginTextArea')}
                    <div className="Login_InputBox">
                      {findAreaByKeyPrefix('LoginEmailArea', { handleEmailChange, email, genericError, handleEmailBlur, emailError })}
                      {findAreaByKeyPrefix('LoginPassArea', { handlePasswordChange, password, genericError, passwordError })}
                    </div>
                    <div className="forgot_terms">
                      <div>
                        <div className="form-custom-check">

                          {findAreaByKeyPrefix('LoginCheckArea', { handleRememberMeChange, rememberMe })}
                        </div>
                      </div>
                    </div>
                    <div className="login_button">
                      {findAreaByKeyPrefix('LoginButtonArea')}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginLayout;
