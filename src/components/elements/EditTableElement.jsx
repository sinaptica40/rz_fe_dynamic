import React from "react";

const EditTableElement = ({
  areas, rzOrderdetails,
  showFormData,
  deleteInspection, setShowModal,
  showModal, handleModal,
  handleFormPage,
  nestedElements,
  modalRef
}) => {
  const filterHeading = areas?.table_columns.filter((item) => item?.table_fields?.data_type != "api")

  const editIcon = areas?.table_columns.find(item => item.table_fields.field_name.includes("edit"));

  const deleteIcon = areas?.table_columns.find(item => item.table_fields.field_name.includes("Delete"));

  const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
    const area = nestedElements.find(area => area.key && area.key.startsWith(prefix));
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

  const handleFormPages = (item, index) =>{
    
    handleFormPage(item, index)
  }

  return (
    <>
      <div className="heading-bg-element">
        <div className="heading-elm-itle">
          {areas?.table_name}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table m b-0">
          <thead className="thbold">
            <tr>
              {filterHeading?.map(({ table_fields }) => {
                return (
                  <th scope="col">{table_fields?.field_name}</th>
                )
              })}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {showFormData?.data?.inspections?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item?.calendar_info?.date ? item?.calendar_info?.date : "00/00/0000"}</td>
                  <td>{item?.ispector_info?.name ? item?.ispector_info?.name : "-"}</td>
                  <td>{item?.working_area_info?.wa_name ? item?.working_area_info?.wa_name : "-"}</td>
                  <td>{item?.machinery_info?.name ? item?.machinery_info?.name : "-"}</td>
                  <td>
                    <div className="table_action_list">
                      <a onClick={() => handleFormPages(item, index)} className="table_actionBtn">
                        <img src={editIcon?.table_fields?.label} />
                      </a>
                      <a onClick={() => handleModal(item?.id_inspection)}
                        className="table_actionBtn">
                        <img src={deleteIcon?.table_fields?.label} />
                      </a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-main-box">
          <div className="modal-inner-box " ref={modalRef}>
            {findAreaByKeyPrefix("FormArea8")}
            {findAreaByKeyPrefix("FormArea9", { showModal })}
            {findAreaByKeyPrefix("FormArea10", { showModal })}
            <div className="modal-btn-group">
              {findAreaByKeyPrefix("FormArea11", { deleteInspection })}
              {findAreaByKeyPrefix("FormArea12", { setShowModal })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EditTableElement