import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../lib/loader/loader";
import {
  useAddNormeMutation,
  useEditNormeMutation,
  useGetEditNormDataQuery,
  useGetNormeLanguageQuery,
  useGetNormeStandardTypeQuery,
  useGetUserDetailsQuery,
} from "../../services/apiSlice";
import { findAreaByKeyPrefix } from "../../utils/helper";
const MainLayout5 = ({ areas }) => {
  const params = useParams();
  const [isFormData, setisFormData] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    file: null,
    id_standard_type: "",
    language: "",
    description: "",
    language: "",
    standard_code: "",
  });

  const [errors, setErrors] = useState({});

  let allApis = areas.filter((item) => {
    return item?.props?.children?.props?.children?.props?.api != null;
  });

  let getapi;
  getapi = allApis.reduce((acc, user) => {
    const key = user?.key;
    const functionName =
      user.props.children.props.children.props.api.function_name;
    const api_Method =
      user?.props?.children?.props?.children?.props?.api?.method_type;

    if (key.includes("FormArea14")) {
      acc.addNorme = functionName;
      acc.addNormeApiMethod = api_Method;
    }
    if (key.includes("FormArea11")) {
      acc.standardApi = functionName;
      acc.standardTypeApiMethod = api_Method;
    }
    if (key.includes("FormArea10")) {
      acc.languageApi = functionName;
      acc.languageApiMethod = api_Method;
    }
    if (key.includes("FormArea14")) {
      acc.editApi = functionName;
      acc.editApiMethod = api_Method;
    }
    if (key.includes("FormArea8")) {
      acc.getEditNorme = functionName;
      acc.getApiMethod = api_Method;
    }
    if (key?.includes("HeaderArea4-3")) {
      acc.userDetailsApi = functionName;
      acc.userDetailsApiMethod = api_Method;
    }
    return acc;
  }, {});

  const validate = (validateDescription = false) => {
    const newErrors = {};

    if (!formValues.file && !validateDescription) {
      newErrors.file = "Si prega di caricare un file PDF.";
    }

    if (!formValues.description) {
      newErrors.description = "Inserisci una descrizione.";
    }

    return newErrors;
  };

  const { data: languageData, isFetching: fetchLanguage } =
    useGetNormeLanguageQuery({
      endpointName: getapi.languageApi,
      method: getapi.languageApiMethod,
      refetchOnMountOrArgChange: true,
    });

  const { data: standardData, isFetching: fetchstandard } =
    useGetNormeStandardTypeQuery({
      endpointName: getapi.standardApi,
      method: getapi.standardTypeApiMethod,
      refetchOnMountOrArgChange: true,
    });

  const edit_id = localStorage.getItem("id_standard");

  const {
    data: editNormedata,
    isFetching,
    refetch,
  } = useGetEditNormDataQuery(
    edit_id
      ? {
          url: getapi.getEditNorme,
          method: getapi.getApiMethod,
          params: {
            id: `${edit_id}`,
          },
          refetchOnMountOrArgChange: true,
        }
      : null
  );

  useCallback(() => {
    if (params["*"]) {
      refetch();
      getapi = {};
    }
  }, [params["*"]]);

  const [addNorme] = useAddNormeMutation();

  const [EditNorme] = useEditNormeMutation();

  useEffect(() => {
    if (editNormedata?.data && !isFetching) {
      const editValue = editNormedata?.data;
      setFormValues({
        fileName: editValue?.name || null,
        // file: editValue?.pdf_name || null,
        // /file_name: editValue?.name || null,
        id_standard_type: editValue.id_standard_type || null,
        language: editValue.language || null,
        full_url: editValue?.full_url,
        description: editValue.description || null,
        standard_code: editValue.standard_code || null,
        // id_standard: editValue?.id_standard || null,
      });
    }
  }, [editNormedata, isFetching]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormValues((prevState) => {
      return {
        ...prevState,
        [name]: files ? files[0] : value,
        file_name: files ? "" : prevState.file_name,
      };
    });
    if (files) {
      setisFormData(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (getapi?.addNorme && getapi.addNormeApiMethod == "POST") {
        // Validate form values
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
        setLoading(true);

        // Set default values for missing fields
        if (!formValues.id_standard_type) {
          formValues.id_standard_type = "1";
        }

        if (!formValues.language) {
          formValues.language = "EN";
        }

        const formData = new FormData();
        formData.append("file", formValues.file);
        formData.append(
          "id_standard_type",
          formValues.id_standard_type || null
        );
        formData.append("language", formValues.language || null);
        formData.append("description", formValues.description || null);
        formData.append("standard_code", formValues.standard_code || "");

        let obj = {
          url: getapi.addNorme,
          method: getapi.addNormeApiMethod,
          data: formData,
        };

        const res = await addNorme(obj);
        if (res?.data?.status == "success" || res?.data?.status == "SUCCESS") {
          toast.success(res?.data?.message);
          setLoading(false);
          navigate(`/${res?.data?.navigate}`);
        } else {
          toast.error(res?.error?.data?.message || "An error occurred");
          setLoading(false);
        }
      } else if (getapi?.editApi && getapi?.editApiMethod == "PUT") {
        const validationErrors = validate(true);
        if (Object.keys(validationErrors).length > 0) {
          setErrors({ description: validationErrors?.description });
          return;
        }
        const formData = new FormData();
        isFormData && formData.append("file", formValues.file);
        formData.append(
          "id_standard_type",
          formValues.id_standard_type || null
        );
        formData.append("language", formValues.language || null);
        formData.append("description", formValues.description || null);
        formData.append("standard_code", formValues.standard_code || "");

        const objEdit = {
          url: getapi.editApi,
          method: getapi.editApiMethod,
          params: edit_id,
          data: formData,
        };
        const res = await EditNorme(objEdit);
        if (res?.data?.status == "success" || res?.data?.status == "SUCCESS") {
          toast.success(res?.data?.message);
          setLoading(false);
          localStorage.removeItem("id_standard");
          navigate(`/${res?.data?.navigate}`);
        } else {
          setLoading(false);
          toast.error(res?.error?.data?.message || "An error occurred");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };

  // user details
  const {
    data: userDetails,
    error,
    isFetchingg,
  } = useGetUserDetailsQuery({
    url: getapi?.userDetailsApi,
    method: getapi?.userDetailsApiMethod,
    refetchOnMountOrArgChange: true,
  });

  return (
    <>
      {(isFetching || loading) && <Loader />}
      <div className="loader-wrapper" style={{ display: "none" }}>
        <div className="loader">
          <img src="img/logo.png" alt="" />
        </div>
      </div>
      {/* Back to Top */}
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
      {/* Header */}
      <header id="header">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-lg">
                {findAreaByKeyPrefix("HeaderArea1", areas) || <div>- -</div>}
                <div className="overlay" style={{ display: "none" }} />
                {findAreaByKeyPrefix("HeaderArea2", areas) || <div>- -</div>}
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
          <div className="cards-block">
            <div className="card-header border-0 add-form-header">
              <div className="card-title">
                {findAreaByKeyPrefix("FormArea7", areas) || <div>- -</div>}
                {findAreaByKeyPrefix("FormArea8", areas) || <div>- -</div>}
              </div>

              {findAreaByKeyPrefix("EditArea4", areas) || <div>- -</div>}
            </div>
            <div className="form-input-block">
              <form onSubmit={handleSubmit}>
                <div className="row row-gap">
                  {findAreaByKeyPrefix("FormArea17", areas, {
                    handleChange,
                    errors,
                    formValues,
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("BodyArea", areas, { formValues })}
                  {findAreaByKeyPrefix("FormArea11", areas, {
                    standardData,
                    handleChange,
                    errors,
                    formValues,
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("FormArea10", areas, {
                    languageData,
                    errors,
                    handleChange,
                    formValues,
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("FormArea13", areas, {
                    errors,
                    handleChange,
                    formValues,
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("FormArea12", areas, {
                    errors,
                    handleChange,
                    formValues,
                  }) || <div>- -</div>}
                  <div className="col-md-12">
                    {findAreaByKeyPrefix("FormArea14", areas) || <div>- -</div>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout5;
