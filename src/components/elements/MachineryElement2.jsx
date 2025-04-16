import React from "react";
import { useNavigate } from "react-router-dom";

const MachineryElement2 = ({
  areas,
  data: machineryData,
  showModal,
  handleModal,
  modalRef,
  handleDeleteNorme,
  setShowModal,
  nestedElements,
}) => {
  const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
    const area = nestedElements.find(
      (area) => area.key && area.key.startsWith(prefix)
    );

    if (area) {
      // Function to recursively clone elements and add extra props
      const deepCloneChildren = (children, extraProps) => {
        return React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Clone child and pass down extraProps
            const clonedChild = React.cloneElement(child, { ...extraProps });

            // If the child has its own children, recurse through them
            if (child.props && child.props.children) {
              const updatedChildren = deepCloneChildren(
                child.props.children,
                extraProps
              );
              return React.cloneElement(clonedChild, {
                children: updatedChildren,
              });
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
      return clonedArea;
    }

    return null;
  };

  const navigate = useNavigate();

  const filteredData = areas?.table_columns.filter(
    (item) => item.table_fields.data_type !== "api"
  );

  const editRoute = areas?.table_columns.filter(
    (item) => item.table_fields.data_type == "api"
  );
  const editIcon = areas?.table_columns.find((item) =>
    item.table_fields.field_name.includes("edito")
  );
  const deleteRoute = areas?.table_columns.find((item) =>
    item.table_fields.field_name.includes("Delete")
  );

  let getapi = editRoute.reduce((acc, user) => {
    const functionName = user?.table_fields?.field_name;
    if (functionName.includes("Delete-macchinari")) {
      acc.deleteMachinery = functionName;
    }
    if (functionName.includes("edito-macchinari")) {
      acc.editMachinery = functionName;
    }

    return acc;
  }, {});

  const handleEdit = (id) => {
    localStorage.setItem("machinery_id", id);
    navigate(getapi.editMachinery);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table m b-0">
          <thead className="thbold">
            <tr>
              {filteredData?.map((table,index) => (
                <th key={index}>{table?.table_fields?.field_name}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {machineryData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item?.name}</td>
                  <td>{item?.typology}</td>
                  <td>
                    {item?.norm_specification?.length
                      ? item?.norm_specification[0]?.standard_types?.focus
                      : ""}
                  </td>
                  {/* <td>
                                            {item?.norm_specification?.length > 0 ?
                                                item?.norm_specification?.map(({ name }) => {
                                                    return (
                                                        <span className="norme-specify mx-1">{name}</span>
                                                    );
                                                })
                                                : '-'
                                            }
                                        </td> */}
                  <td>
                    {item?.norm_specification?.length > 0
                      ? item?.norm_specification
                        .reduce((acc, curr, index) => {
                          const chunkIndex = Math.floor(index / 2);
                          if (!acc[chunkIndex]) acc[chunkIndex] = [];
                          acc[chunkIndex].push(curr);
                          return acc;
                        }, [])
                        .map((group, idx) => (
                          <div key={idx} className="mb-4">
                            {group.map(({ name }, i) => (
                              <span key={i} className="norme-specify mx-1">
                                {name}
                              </span>
                            ))}
                          </div>
                        ))
                      : "-"}
                  </td>

                  <td>
                    <div className="table_action_list">
                      <a
                        style={{ cursor: "Pointer" }}
                        onClick={() => handleEdit(item?.id_machinery_type)}
                        className="table_actionBtn"
                      >
                        <img src={editIcon?.table_fields?.label} />
                      </a>
                      <a
                        style={{ cursor: "Pointer" }}
                        onClick={() => handleModal(item?.id_machinery_type)}
                        className="table_actionBtn"
                      >
                        <img src={deleteRoute.table_fields?.label} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-main-box">
          <div className="modal-inner-box" ref={modalRef}>
            {findAreaByKeyPrefix("FormArea8")}
            {findAreaByKeyPrefix("FormArea9")}
            {findAreaByKeyPrefix("FormArea10")}
            <div className="modal-btn-group">
              {findAreaByKeyPrefix("FormArea11", { handleDeleteNorme })}
              {findAreaByKeyPrefix("FormArea12", { setShowModal })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MachineryElement2;
