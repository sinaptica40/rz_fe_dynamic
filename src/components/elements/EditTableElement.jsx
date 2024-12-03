import React from "react";

const EditTableElement = ({
                areas,rzOrderdetails,
                deleteInspection,setShowModal,
                showModal,handleModal,
                handleFormPage,
                nestedElements
              }) => {
  const filterHeading = areas?.table_columns.filter((item)=>item?.table_fields?.data_type != "api")
 

  const editIcon = areas?.table_columns.find(item=> item.table_fields.field_name=="edit icon");
  
 
    const deleteIcon = areas?.table_columns.find(item=> item.table_fields.field_name=="Delete-ispection");

    const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
      const area = nestedElements.find(area => area.key && area.key.startsWith(prefix));

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
          return clonedArea;
      }

      return null;
  };
   
   
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
              {filterHeading?.map(({table_fields})=>{
                return(
               <th scope="col">{table_fields?.field_name}</th>
              )})}
              {/* <th scope="col">Macchinario</th>
              <th scope="col">Ispettore</th>
              <th scope="col">Area Lavoro</th>
              <th scope="col">Data Ispezione</th>
              <th scope="col" /> */}
            </tr>
          </thead>
          <tbody>
           

              {rzOrderdetails?.data?.inspections?.map((item,index)=>{
                return(
                  <tr key={index}>
                  <td>{item?.calendar_info?.date}</td>
                 <td>{item?.ispector_info?.name}</td>
                  <td>{item?.working_area_info?.wa_name}</td>
                  <td>{item?.machinery_info?.brand_name}</td>
                  <td>
                  <div className="table_action_list">
                  <a onClick={()=>handleFormPage(item,index)} className="table_actionBtn">
                    <img src={editIcon?.table_fields?.label} />
                   
                  </a>
                  <a onClick={()=>handleModal(item?.id_inspection)}
                   className="table_actionBtn">
                    <img src = {deleteIcon?.table_fields?.label} />
                
                  </a>
                </div>
              </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* {showModal && (
                <div className="modal-main-box">
                    <div className="modal-inner-box">
                        <span className="info-iocn">
                            !
                        </span>
                       
                            <span>
                             Are You Sure
                            </span>
                            <div>
                            <span>
                            You Would not be able to revert this!
                            </span>
                            </div>
                                
                                <div className="modal-btn-group">
                                    
                                    <div className="col-md-4">
                                     <div className="form-floating">
                                    <button onClick={deleteInspection}>
                                       Yes
                                      </button>
                                      </div>
                                     </div>
                                      <div className="col-md-4">
                                     <div className="form-floating">
                                     <button onClick={()=>setShowModal(false)}>
                                      No
                                     </button>

                                     </div>
                                     </div>
                              
                        </div>
                    </div>
                </div>
      )} */}

{showModal && (
            <div className="modal-main-box">
                <div className="modal-inner-box">
                    {/* <span className="info-iocn">
                        !
                    </span> */}
                    {findAreaByKeyPrefix("FormArea8")}
                   {findAreaByKeyPrefix("FormArea9")}
                   {findAreaByKeyPrefix("FormArea10")}
                    <div className="modal-btn-group">
                        {findAreaByKeyPrefix("FormArea11",{deleteInspection})}
                        {findAreaByKeyPrefix("FormArea12",{setShowModal})}
                   </div>
                   
                </div>
            </div>
            )}
    </>
  )
}

export default EditTableElement