import React, { useState } from "react";
import { getClassName } from "../../utils/helper";

const EditElement3 = ({ areas, stateListing, status, setStatus }) => {
  const [isToggele, setIsToggle] = useState(false);

  return (
    <>
      <div className="action_dropdownBox">
        <span className="drop-statusText">
          {areas?.element_data?.block_name}
        </span>
        <div className="dropdown">
          <button
            className={`action-btn dropdown-toggle ${getClassName(
              status?.id_state
            )}`}
            onClick={() => setIsToggle(true)}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {status?.state ? status?.state : stateListing?.[0]?.state}
          </button>
          <ul
            className={`dropdown-menu dropdown-menu-dark ${
              isToggele ? "show" : ""
            }`}
          >
            {stateListing &&
              stateListing.length > 0 &&
              stateListing.map((state, index) =>
                state?.id_state !== 1 ? (
                  <li key={index}>
                    <a
                      className={`dropdown-item ${getClassName(
                        state?.id_state
                      )}`}
                      href="#"
                      onClick={() => {
                        setStatus({
                          state: state?.state,
                          id_state: state?.id_state,
                        });
                        setIsToggle(false);
                      }}
                    >
                      {state.state}
                    </a>
                  </li>
                ) : null
              )}
          </ul>
        </div>
      </div>
    </>
  );
};
export default EditElement3;
