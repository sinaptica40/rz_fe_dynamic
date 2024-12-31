import React from "react";
import { useNavigate } from "react-router-dom";

const IspezioniElement1 = ({ areas,TableData1 }) => {
    
    const navigate = useNavigate();

    const filteredData = areas?.table_columns
    .filter(item => item.table_fields.data_type !== "api");

    const addRoute = areas?.table_columns.find(item=> item.table_fields.data_type=="api");

    const handleAddRoute =(item)=>{
        localStorage.setItem("id_order",item?.id_order);
        localStorage.setItem("order_Data",JSON.stringify({"order_code":item?.order_code,"client":item?.client}))
        localStorage.setItem("addRoute",addRoute?.table_fields?.page)
        navigate(`/${addRoute?.table_fields?.page}`);
    }
    
    return (
        <>
            <div className="card-block-body">
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead className="thbold">
                            <tr>
                                {filteredData?.map((item)=>(
                                    <th>{item?.table_fields?.field_name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TableData1?.data?.map((item)=>(
                                <tr>
                                    <td>{item?.client}</td>
                                    <td>{item?.order_code}</td>
                                    <td>
                                    <div className="descTableMax">
                                        {item?.description}
                                    </div>
                                    </td>
                                    <td className="text-end">
                                    <div className="btnRight">
                                        <a onClick={()=>handleAddRoute(item)} className="planRightDete">
                                            <img src={addRoute?.table_fields?.label}/>
                                        </a>
                                    </div>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default IspezioniElement1