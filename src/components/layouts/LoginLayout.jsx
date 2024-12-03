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
   
    const loginApi = areas.find((item) => {
       // console.log("item?.props?.children?.props?.children?.props?.api?.function_name", item?.props?.children?.props?.children?.props?.api?.function_name);
        return item?.props?.children?.props?.children?.props?.api != null;
      });


//       const apiLogin = areas.filter((item) => {
//         // console.log("item?.props?.children?.props?.children?.props?.api?.function_name", item?.props?.children?.props?.children?.props?.api?.function_name);
//          return item?.props?.children?.props?.children?.props?.api != null;
//        });
//        function get all api
//        const api = { 
//         loginRoute: {
//          login :"login",
//          loginMethod: "loginMethod"
//          },
//          forgetRoute: {
//           forget: "forget",
//           forgetMethod:"forgetMethod",
//          }
//         };

//         const getapi = apiLogin.reduce((acc, user) => {
//         const functionName = user.props.children.props.children.props.api.function_name;
//         const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;
//        console.log(api_Method,"api_Method")
//   // Check if function_name contains 'login'
//        if (functionName.includes("login")) {
//          acc[api.loginRoute.login] = functionName;
//           acc[api.loginRoute.loginMethod] = api_Method;
//         }

//   // Check if function_name contains 'forget'
//          if (functionName.includes("forget")) {
//          acc[api.forgetRoute.forget] = functionName;
//           acc[api.forgetRoute.forgetMethod] = api_Method;
//         }

//          return acc;
//        }, {});
//  console.log("loginApi",getapi.login)


    const handleEmailBlur = () => {
        // Validate email format when the input loses focus
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
            
            // Function to recursively clone elements and add extra props
            const deepCloneChildren = (children, extraProps) => {
                return React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        // Clone child and pass down extraProps
                        const clonedChild = React.cloneElement(child, { ...extraProps });
                        
                        // If the child has its own children, recurse through them
                        if (child.props && child.props.children) {
                            const updatedChildren = deepCloneChildren(child.props.children, extraProps);
                            return React.cloneElement(clonedChild, { children: updatedChildren });
                        }
    
                        return clonedChild;
                    }
    
                    return child; // Return non-element children as is (e.g., strings, numbers)
                });
            };
    
            // Clone the area element itself and its nested children
            const clonedArea = React.cloneElement(area, { 
                ...extraProps,
                children: deepCloneChildren(area.props.children, extraProps),
            });
    
            // Optionally log the modified children
           // console.log(prefix, clonedArea?.props?.children);
    
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
      // else if (!/\S+@\S+\.\S+/.test(email)) {
      //   setEmailError("Please enter a valid email address.");
      //   valid = false;
      // }
  
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
        console.log("e.target.value",e.target.value)
        setPassword(e.target.value)
    };
    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked)
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        let genericErrorMessage = "";
        try {
          if(validateForm()){
            if(loginApi){
               const apiUrl = loginApi?.props?.children?.props?.children?.props?.api?.function_name;
               const api_Method = loginApi?.props?.children?.props?.children?.props?.api?.method_type;
               const credentials = {
                   url: apiUrl,         
                   method: api_Method,       
                   data: {
                       email: email,  
                       password: password,
                    }
                };
               
                 const response = await login(credentials);
                 console.log(response?.data?.data?.naviagate,"response")
        
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
                    console.log("response?.data?.data?.access_token",response?.data?.data?.access_token)
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
            {/* loader */}
            <div className="loader-wrapper" style={{ display: "none" }}>
                <div className="loader">
                    <img src="img/mobile-logo.png" alt="" />
                </div>
            </div>
            {/* main */}
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
                                            {/* {console.log(findAreaByKeyPrefix('LoginEmailArea', { handleEmailChange, email }), "props=== rr")} */}
                                            {/* Pass `handleEmailChange` and `email` to the `LoginEmailArea` */}
                                            {findAreaByKeyPrefix('LoginEmailArea', { handleEmailChange, email,genericError,handleEmailBlur,emailError })}
                                            {findAreaByKeyPrefix('LoginPassArea',{handlePasswordChange,password,genericError,passwordError})}
                                        </div>
                                        <div className="forgot_terms">
                                            <div>
                                                <div className="form-custom-check">
                    
                                                    {findAreaByKeyPrefix('LoginCheckArea',{handleRememberMeChange,rememberMe})}
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
