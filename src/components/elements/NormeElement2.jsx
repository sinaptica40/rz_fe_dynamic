import React, { useState } from "react";
import moment from 'moment'
import { useNavigate } from "react-router-dom";

const NormaElement2 = ({ areas, data, nestedElements, handleDeleteNorme, handleModal, modalRef, showModal, setShowModal }) => {

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

    const navigate = useNavigate();

    const filteredData = areas?.table_columns
        .filter(item => item.table_fields.data_type !== "api");

    const editRoute = areas?.table_columns.find(item => item.table_fields.field_name.includes("edito-norma"));
    const deleteRoute = areas?.table_columns.find(item => item.table_fields.field_name.includes("Delete"));

    const handleEdit = (id) => {
        localStorage.setItem('id_standard', id);
        navigate(editRoute?.table_fields?.field_name);
    };

    return (
        <>
            <div className="card-block-body">
                <div className="table-responsive">
                    <table className="table m b-0">
                        <thead className="thbold">
                            <tr>
                                {filteredData?.map((tableHead) => {
                                    return (
                                        <th>
                                            {tableHead?.table_fields?.field_name}
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((item, index) => {
                                return (
                                    <tr>
                                       {item?.id_notification? 
                                        <td>{item?.id_notification}</td> : 
                                        <td>
                                            <div>
                                                <a className="pdf-file" href={item?.full_url}>
                                                    {item?.title ? item?.title : item?.name}
                                                </a>
                                            </div>
                                        </td>
                                        }
                                        <td>{item?.title ? item?.title : item?.language}</td>
                                        <td>{item?.created_at ? moment(item?.created_at).format('YYYY-MM-DD') : `${item?.standard_types?.type} (${item?.standard_types?.focus})`} </td>
                                        <td>{item?.description}</td>
                                        <td>{item?.standard_code}</td>

                                        <td>
                                            <div className="table_action_list">
                                                <a onClick={() => handleEdit(item?.id_standard)} className="table_actionBtn">
                                                    <img src={editRoute?.table_fields?.label} />
                                                </a>
                                                <a onClick={() => handleModal(item?.id_standard)} className="table_actionBtn">
                                                    <img src={deleteRoute?.table_fields?.label} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
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
    )
}

export default NormaElement2