import React, { useState } from "react";
import {
  useLoginMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
} from "../../services/apiSlice";
import { isTokenExpired } from "../../utils/helper";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../lib/loader/loader";
import { loadScript } from "../../utils/helper";
import { findAreaByKeyPrefix } from "../../utils/helper";
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
  const route = location.pathname.substring(1) || "/";
  const [isPopUp, setIsPopUp] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  let getApi = areas
    .filter(
      (item) => item?.props?.children?.props?.children?.props?.api != null
    )
    .reduce((acc, user) => {
      const key = user?.key;
      const functionName =
        user.props.children.props.children.props.api.function_name;
      const api_Method =
        user?.props?.children?.props?.children?.props?.api?.method_type;

      if (key?.includes("LoginButtonArea")) {
        acc.loginApiUrl = functionName;
        acc.loginApi_Method = api_Method;
      }
      if (key?.includes("LoginForgetArea-6")) {
        acc.loginForgetApi = functionName;
        acc.loginForgetApiMethod = api_Method;
      }

      return acc;
    }, {});

  const handleEmailBlur = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Per favore, inserisci un indirizzo email valido.");
    } else {
      setEmailError("");
    }
  };

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("L'email è obbligatoria.");
      valid = false;
    }

    if (!password) {
      setPasswordError("La password è obbligatoria.");
      valid = false;
    }

    return valid;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let genericErrorMessage = "";
    try {
      if (validateForm()) {
        setIsLoading(true);
        if (getApi) {
          const credentials = {
            url: getApi?.loginApiUrl,
            method: getApi?.loginApi_Method,
            data: {
              email: email,
              password: password,
            },
          };

          const response = await login(credentials);

          if (response.data.status !== "SUCCESS") {
            setIsLoading(false);
            if (typeof response.data.message === "object") {
              setIsLoading(false);
              setEmailError(response.data.message.email || "");
              setPasswordError(response.data.message.password || "");
            } else {
              setIsLoading(false);
              genericErrorMessage = response.data.message;
            }
          } else {
            setIsLoading(false);
            if (
              response?.data?.data?.access_token &&
              response?.data?.data?.access_token !== "undefined"
            ) {
              if (rememberMe) {
                localStorage.setItem("check", rememberMe);
                localStorage.setItem(
                  "access_token",
                  response?.data?.data?.access_token
                );
                localStorage.setItem(
                  "user_name",
                  response?.data?.data?.user?.name
                );
                localStorage.setItem("user_id", response?.data?.data?.user?.id);
              } else {
                sessionStorage.setItem(
                  "access_token",
                  response?.data?.data?.access_token
                );
                sessionStorage.setItem(
                  "user_name",
                  response?.data?.data?.user?.name
                );
                sessionStorage.setItem(
                  "user_id",
                  response?.data?.data?.user?.id
                );
              }

              if (response?.data?.data?.access_token) {
                if (isTokenExpired(response?.data?.data?.access_token)) {
                  localStorage.removeItem("access_token");
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
      toast.error(genericErrorMessage);
    }
  };

  const ModelOpen = () => {
    setIsPopUp(true);
  };

  const ModelClose = () => {
    setStep(1);
    setIsPopUp(false);
  };
  const [sendOpt] = useSendOtpMutation();
  const handleSendOtp = async (email) => {
    try {
      sessionStorage.setItem("email", email);
      setIsLoading(true);
      const response = await sendOpt({
        url: getApi?.loginForgetApi,
        method: getApi?.loginForgetApiMethod,
        body: { email: email },
      }).unwrap();

      if (response.status === "SUCCESS") {
        setIsLoading(false);
        toast.success(response?.message);
        setStep(2);
      } else if (response.status === "ERROR" || response.status === "FAIL") {
        setIsLoading(false);
        toast.error(response?.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  const [resetPassword] = useResetPasswordMutation();

  const handlePasswordReset = async (
    otp,
    newPassword,
    confirmPassword,
    emails
  ) => {
    const email = sessionStorage.getItem("email");
    try {
      setIsLoading(true);
      const body = {
        otp: parseInt(otp.join("")),
        password: newPassword,
        confirm_password: confirmPassword,
        email,
      };

      const response = await resetPassword(body).unwrap();
      if (response.status === "SUCCESS") {
        sessionStorage.removeItem("email");
        setIsLoading(false);
        toast.success(response?.message);
        ModelClose();
        return response.status;
      } else if (response.status === "ERROR" || response.status === "FAIL") {
        setIsLoading(false);
        toast.error(response?.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  if (isLoading) return <Loader />;

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
                {findAreaByKeyPrefix("LoginLeftArea", areas)}
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="login_sign_up_block">
                    {findAreaByKeyPrefix("LoginTextArea", areas)}
                    <div className="Login_InputBox">
                      {findAreaByKeyPrefix("LoginEmailArea", areas, {
                        handleEmailChange,
                        email,
                        genericError,
                        handleEmailBlur,
                        emailError,
                      })}
                      {findAreaByKeyPrefix("LoginPassArea", areas, {
                        handlePasswordChange,
                        password,
                        genericError,
                        passwordError,
                      })}
                    </div>
                    <div className="forgot_terms">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="form-custom-check">
                          {findAreaByKeyPrefix("LoginCheckArea", areas, {
                            handleRememberMeChange,
                            rememberMe,
                          })}
                        </div>
                        <div>
                          {findAreaByKeyPrefix("LoginForgetArea", areas, {
                            ModelOpen,
                          })}
                          <LoginForgetElementModel
                            isOpen={isPopUp}
                            onClose={ModelClose}
                            step={step}
                            handleSendOtp={handleSendOtp}
                            handlePasswordReset={handlePasswordReset}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="login_button">
                      {findAreaByKeyPrefix("LoginButtonArea", areas)}
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

const LoginForgetElementModel = ({
  isOpen,
  onClose,
  step,
  handleSendOtp,
  handlePasswordReset,
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  // Handle OTP input change with backspace handling
  const handleOtpChange = (index, value, event) => {
    const newOtp = [...otp];

    if (event.key === "Backspace" && newOtp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    } else if (/^\d?$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);
      setErrors((prev) => ({ ...prev, otp: "" }));

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle password inputs
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrors((prev) => ({ ...prev, newPassword: "" }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
  };

  // Email Submit Handler
  const handleEmailSubmit = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "L'e-mail è obbligatoria.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Inserisci un indirizzo email valido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    handleSendOtp(email);
  };

  // Password Reset Handler
  const handlePasswordResets = async () => {
    let newErrors = {};

    if (otp.some((digit) => digit === "")) {
      newErrors.otp = " L'OTP deve essere composto da 4 cifre.";
    }

    if (!newPassword) {
      newErrors.newPassword = "La nuova password è obbligatoria.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "La password deve contenere almeno 6 caratteri.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "La conferma della password è obbligatoria.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Le password non corrispondono.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const resp = await handlePasswordReset(
      otp,
      newPassword,
      confirmPassword,
      email
    );

    if (resp && resp === "SUCCESS") {
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp(["", "", "", ""]);
    }else{
      toast.error(resp)
    }
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered className="themeModal">
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 1 ? "Ha dimenticato la password?" : "Reimposta password"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 ? (
          <Form className="modal_form_box">
            <div className="mb-3">
              <p className="modal_form_desc">
                Non preoccuparti! Reimpostare la tua password è facile, basta
                digitare l'email che hai usato per registrarti su RZ Solution.
              </p>
              <div className="form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci la tua email"
                  value={email}
                  onChange={handleEmailChange}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
            </div>
            <div className="text-center my-2">
              <Button variant="primary" onClick={handleEmailSubmit}>
                Invia OTP
              </Button>
            </div>
          </Form>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <p className="modal_form_desc">
                Non preoccuparti! Reimpostare la password è semplice, basta
                digitare l'e-mail con cui ti sei registrato su RZ Solution.
              </p>

              <div className="otp_main_box">
                {otp?.map((digit, index) => (
                  <div className="otp_inout_box">
                    <Form.Control
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(index, e.target.value, e)
                      }
                      onKeyDown={(e) => handleOtpChange(index, "", e)}
                      className="text-center otp-field"
                    />
                  </div>
                ))}
              </div>
              {errors.otp && (
                <small className="text-danger">{errors.otp}</small>
              )}
            </Form.Group>

            <div className="form-group">
              <Form.Label>Nuova password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci la nuova password"
                value={newPassword}
                onChange={handlePasswordChange}
              />
              {errors.newPassword && (
                <small className="text-danger">{errors.newPassword}</small>
              )}
            </div>

            <div className="form-group">
              <Form.Label>Conferma password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Conferma la nuova password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword}</small>
              )}
            </div>

            <div className="text-center my-2">
              <Button variant="primary" onClick={handlePasswordResets}>
                Reimposta password
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoginLayout;
