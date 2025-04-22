import { useState } from "react";
import { useGetConformityTypesQuery } from "../services/apiSlice";
import ConformityDetected from "./ConformityDetected";
const NonConformity = ({ setSubTitle, subTitle, setDisplay }) => {
    const imagePaths = [
      "img/finalizza1.png",
      "img/finalizza2.png",
      "img/finalizza3.png",
      "img/finalizza4.png",
      "img/finalizza5.png",
      "img/finalizza6.png",
    ];
  
    const { data, isLoading, refetch } = useGetConformityTypesQuery({
      endpoints: "/api/v1/conformity/ncType",
    });
  
    const [conformaty, setConformaty] = useState(true);
    const [cluserData, setClusterData] = useState([]);
  
    const showClusters = (clusters) => {
      setClusterData(clusters);
      setConformaty(false);
    };
  
    const handleCluster = (clusterValues) => {
      showClusters(clusterValues);
    };
  
    if (isLoading) return <div>Loading ....</div>;
  
    return (
      <>
        {conformaty ? (
          <div className="layout">
            <div className="report_innerBox">
              <div className="row g-4">
                {data?.data?.map((value, index) => (
                  <div key={index} className="col-lg-4 col-sm-4 col-6 col-xxl-2">
                    <a className="d-block">
                      <div
                        className="finalizza_cardBox"
                        style={{cursor: "pointer"}}
                        onClick={() => handleCluster(value)}
                      >
                        <img src={imagePaths[index] || "img/default.png"} alt={`Step ${index + 1}`} />
                        <h3>{value?.nc_name}</h3>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ConformityDetected
            subTitle={subTitle}
            clusterdata={cluserData}
            setConformaty={setConformaty}
            setDisplay={setDisplay}
            setSubTitle={setSubTitle}
            fetchedClusterPoints={refetch}
          />
        )}
      </>
    );
  };

  export default NonConformity