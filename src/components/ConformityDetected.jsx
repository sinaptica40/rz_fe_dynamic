import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateClusterMutation } from "../services/apiSlice";
const ConformityDetected = ({
    subTitle,
    clusterdata,
    setConformaty,
    setDisplay,
    setSubTitle,
    fetchedClusterPoints,
  }) => {
    const [pointData, setPointData] = useState(subTitle || {});
  
    const [errors, setErrors] = useState({
      name: "",
      priority: "",
    });
  
    const [createCluster] = useCreateClusterMutation();
  
    const [name, setName] = useState("");
    const [priority, setPriority] = useState()
  
    useEffect(() => {
      // Set the first cluster item as the default selected pointData on component mount
      if (!pointData?.name && clusterdata?.cluster?.length > 0) {
        const defaultCluster = clusterdata.cluster.find(item => item.id_cluster === subTitle?.id_cluster) || clusterdata.cluster[0];
        setPointData(defaultCluster);
        setSubTitle(defaultCluster);
      }
    }, [clusterdata, subTitle]);
  
    const handlePointData = (points) => {
      setPointData(points);
      setSubTitle(points);
      setDisplay(false);
    };
  
    const handleInputChange = (field, value) => {
      setPointData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  
    const validate = () => {
      const newErrors = {};
      if (!name.trim()) newErrors.name = 'Il nome è obbligatorio.';
      if (!priority || isNaN(priority) || Number(priority) < 0) {
        newErrors.priority = 'La priorità deve essere un numero non negativo.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleCreateCluster = async () => {
      if (!validate()) {
        return;
      }
  
      try {
        const response = await createCluster({
          url: `/api/v1/conformity/create-cluster`,
          method: "POST",
          body: {
            name: name,
            priority: priority,
            id_not_conformity_type: clusterdata?.id_not_conformity_type,
          },
        }).unwrap();
  
        if (response.status === "SUCCESS") {
          toast.success(response.message);
          setName("")
          setPriority("")
          fetchedClusterPoints();
  
          const cancelButton = document.querySelector('#aggiungiModal0 .modal-footer .modal_borderBtn');
          if (cancelButton) {
            cancelButton.click();
          }
          setDisplay(false)
        }else{
          toast.error(response.message);
          setName("")
          setPriority("")
        }
      } catch (error) {
        console.log(error);
        toast.error(error.data.message);
      }
    };
  
    return (
      <>
        <div className="layout">
          <div className="contentBox">
            <div className="report_innerBox">
              <div className="report_appliedBox">
                <div className="rischi_innerBox">
                  <a style={{cursor: "Pointer"}} className="close-iconBtn" onClick={() => setDisplay(false)}>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.05096 1.10498C1.21899 0.936596 1.41859 0.803006 1.63831 0.711857C1.85804 0.620708 2.09358 0.573792 2.33146 0.573792C2.56934 0.573792 2.80489 0.620708 3.02462 0.711857C3.24434 0.803006 3.44393 0.936596 3.61196 1.10498L13.184 10.681L22.756 1.10498C23.0968 0.771233 23.5555 0.58543 24.0325 0.587931C24.5095 0.590431 24.9663 0.781033 25.3036 1.11834C25.6409 1.45564 25.8315 1.9124 25.834 2.38941C25.8365 2.86642 25.6507 3.32516 25.317 3.66598L15.741 13.238L25.317 22.81C25.6507 23.1508 25.8365 23.6095 25.834 24.0865C25.8315 24.5636 25.6409 25.0203 25.3036 25.3576C24.9663 25.6949 24.5095 25.8855 24.0325 25.888C23.5555 25.8905 23.0968 25.7047 22.756 25.371L13.184 15.795L3.61196 25.371C3.27114 25.7047 2.81241 25.8905 2.3354 25.888C1.85838 25.8855 1.40162 25.6949 1.06432 25.3576C0.727017 25.0203 0.536415 24.5636 0.533915 24.0865C0.531414 23.6095 0.717216 23.1508 1.05096 22.81L10.627 13.238L1.05096 3.66598C0.88258 3.49795 0.748989 3.29836 0.657841 3.07863C0.566692 2.85891 0.519775 2.62336 0.519775 2.38548C0.519775 2.1476 0.566692 1.91205 0.657841 1.69233C0.748989 1.4726 0.88258 1.27301 1.05096 1.10498Z"
                        fill="currentcolor"
                      />
                    </svg>
                  </a>
                  <h2 className="rischi_title">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9998 9.00023V13.0002M11.9998 17.0002H12.0098M10.6151 3.89195L2.39019 18.0986C1.93398 18.8866 1.70588 19.2806 1.73959 19.6039C1.769 19.886 1.91677 20.1423 2.14613 20.309C2.40908 20.5002 2.86435 20.5002 3.77487 20.5002H20.2246C21.1352 20.5002 21.5904 20.5002 21.8534 20.309C22.0827 20.1423 22.2305 19.886 22.2599 19.6039C22.2936 19.2806 22.0655 18.8866 21.6093 18.0986L13.3844 3.89195C12.9299 3.10679 12.7026 2.71421 12.4061 2.58235C12.1474 2.46734 11.8521 2.46734 11.5935 2.58235C11.2969 2.71421 11.0696 3.10679 10.6151 3.89195Z"
                        stroke="#ECAD42"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {clusterdata?.nc_name}
                  </h2>
                  <ul className="rischi_checkBox">
                    {clusterdata?.cluster?.map((value, index) => (
                      <li key={index} className="rischi_chack" onClick={() => handlePointData(value)}>
                        <input type="radio" name="risk" id={`risk-${index}`} checked={pointData?.id_cluster === value.id_cluster} readOnly />
                        <label htmlFor={`risk-${index}`}>{value?.name}</label>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="generate_aiBtn"
                    data-bs-toggle="modal"
                    data-bs-target="#aggiungiModal0"
                  >
                    + Aggiungi nuovo cluster
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Modal for adding new cluster */}
        <div
          className="modal fade modalTheme"
          id="aggiungiModal0"
          tabIndex="-1"
          aria-labelledby="aggiungiModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="aggiungiModalLabel">
                  Aggiungi nuova gruppo
                </h5>
             
              </div>
              <div className="modal-body">
                <div className="form-input-block p-0">
                  <form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className={`form-control ${errors.name ? "is-invalid" : ""
                              }`}
                            id="floatingInput"
                            value={name}
                            placeholder="Name"
                            onChange={(e) => {
                              setName(e.target.value);
                              if (errors.name) {
                                setErrors((prev) => ({ ...prev, name: null }));
                              }
                            }}
                          />
                          <label htmlFor="floatingInput">Nome</label>
                          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-floating mb-3">
                          <input
                            type="number"
                            className={`form-control ${errors.priority ? "is-invalid" : ""
                              }`}
                            id="floatingInput1"
                            value={priority}
                            placeholder="Priority"
                            onChange={(e) => {
                              setPriority(e.target.value);
                              if (errors.priority) {
                                setErrors((prev) => ({ ...prev, priority: null }));
                              }
                            }}
                          />
                          <label htmlFor="floatingInput1">Priorità</label>
                          {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={handleCreateCluster}
                  type="button"
                  className="modal_solidBtn"
                >
                  Confermare
                </button>
                <button
                  type="button"
                  className="modal_borderBtn"
                  data-bs-dismiss="modal"
                >
                  Cancellare
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  export default ConformityDetected