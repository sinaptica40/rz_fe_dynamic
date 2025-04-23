import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../lib/loader/loader";
import {
  useGetOdersIspezione1Query,
  useGetUserDetailsQuery,
  useUpdateProfileMutation,
} from "../../services/apiSlice";
import { findAreaByKeyPrefix } from "../../utils/helper";
const MainLayout14 = ({ areas }) => {
  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    surname: "",
    email: "",
    profileImage: "",
    profileImageFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUser) => ({ ...prevUser, [name]: value }));
  };

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

      if (key?.includes("FormArea14-7")) {
        acc.editProfileApi = functionName;
        acc.editProfileApiMethod = api_Method;
      }

      if (key?.includes("FormArea17-8")) {
        acc.userDetailApi = functionName;
        acc.userDetailApiMethod = api_Method;
      }
      return acc;
    }, {});

  // user details
  const {
    data: userDetails,
    error,
    ifFetching,
    refetch,
  } = useGetUserDetailsQuery({
    url: getApi.userDetailApi,
    method: getApi.userDetailApiMethod,
  });

  useEffect(() => {
    if (userDetails?.data) {
      setUserData((prevData) => ({
        ...prevData,
        username: userDetails?.data?.username || "",
        fullname: userDetails?.data?.name || "",
        surname: userDetails?.data?.surname || "",
        email: userDetails?.data?.mail || "",
        profileImageFile: null, // Keep image upload separate
        profileImage: userDetails?.data?.image || "/img/header_user.png", // Default if no image
      }));
    }
  }, [userDetails]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setUserData((prevUser) => ({
        ...prevUser,
        profileImage: blobUrl,
        profileImageFile: file,
      }));
    }
  };

  const [updateProfile] = useUpdateProfileMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("name", userData.fullname);
      formData.append("surname", userData.surname);
      formData.append("mail", userData.email);

      // If the user uploaded a new profile image, send it
      if (userData.profileImageFile) {
        formData.append("image", userData.profileImageFile);
      }

      const response = await updateProfile({
        url: getApi.editProfileApi,
        method: getApi.editProfileApiMethod,
        body: formData, // Send FormData instead of userData object
      }).unwrap();
      if (response?.status === "SUCCESS") {
        setIsLoading(false);
        refetch();
        toast.success("Profile updated successfully!");
      } else if (response.status === "ERROR" || response.status === "FAIL") {
        toast.error(response?.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating profile:", error);
    }
  };
  if (isLoading || ifFetching) return <Loader />;

  return (
    <>
      {/* {(isFetching1) && <Loader />} */}
      <div className="loader-wrapper" style={{ display: "none" }}>
        <div className="loader">
          <img src="img/logo.png" alt="" />
        </div>
      </div>
      <div className="progress-wrap cursor-pointer">
        <svg
          className="arrowTop"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.99996 15.9999H6.99996V3.99991L1.49996 9.49991L0.0799561 8.07991L7.99996 0.159912L15.92 8.07991L14.5 9.49991L8.99996 3.99991V15.9999Z"
            fill="black"
          />
        </svg>
        <svg
          className="progress-circle svg-content"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{
              transition: "stroke-dashoffset 10ms linear 0s",
              strokeDasharray: "307.919, 307.919",
              strokeDashoffset: "307.919",
            }}
          ></path>
        </svg>
      </div>
      <header id="header">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-lg">
                {findAreaByKeyPrefix("HeaderArea1", areas) || <div>- -</div>}
                <div className="overlay" style={{ display: "none" }} />
                {findAreaByKeyPrefix("HeaderArea2", areas) || <div>- -</div>}
                {/* {findAreaByKeyPrefix('HeaderArea3') || <div>- -</div>} */}
                {findAreaByKeyPrefix("HeaderArea4", areas, { userDetails }) || (
                  <div>- -</div>
                )}
                <button className="navbar-toggler" type="button">
                  <span className="navbar-toggler-icon" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <div className="webcontent-wrapper">
        <div className="container-fluid p-0">
          <div className="row">
            {/* <div className="col-lg-12"> */}
            <div>
              <div className="cards-block">
                {findAreaByKeyPrefix("EditArea4", areas) || <div>- -</div>}
                <div className="form-input-block">
                  <form onSubmit={handleSubmit}>
                    <div className="row row-gap">
                      {findAreaByKeyPrefix("FormArea17", areas, {
                        userData,
                        handleImageChange,
                      }) || <div>- -</div>}
                      {findAreaByKeyPrefix("FormArea13", areas, {
                        userData,
                        handleChange,
                      }) || <div>- -</div>}
                      {findAreaByKeyPrefix("FormArea18", areas, {
                        userData,
                        handleChange,
                      }) || <div>- -</div>}
                      {findAreaByKeyPrefix("FormArea10", areas, {
                        userData,
                        handleChange,
                      }) || <div>- -</div>}
                      {findAreaByKeyPrefix("FormArea12", areas, {
                        userData,
                        handleChange,
                      }) || <div>- -</div>}
                    </div>
                    <div className="mt-5 mb-5">
                      {findAreaByKeyPrefix("FormArea14", areas) || (
                        <div>- -</div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout14;
