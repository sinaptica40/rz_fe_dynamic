import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const NormaElement2 = ({areas,data,nestedElements,handleDeleteNorme,handleModal,modalRef ,showModal,setShowModal}) => {

   

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
  
  const navigate= useNavigate();
  
    const filteredData = areas?.table_columns
    .filter(item => item.table_fields.data_type !== "api");

  

    const editRoute = areas?.table_columns.find(item=> item.table_fields.field_name.includes("edito-norma"));
    const deleteRoute = areas?.table_columns.find(item=> item.table_fields.field_name.includes("Delete"));
    



    const handleEdit = (id) => {
        localStorage.setItem('id_standard',id); 
       navigate(editRoute?.table_fields?.field_name);
    };
    

    return (
        <>
            {/* <div className="card-header border-0 pb-0 add-form-header"> */}
                {/* <div className="card-title">
                    <span className="title-icon">
                        <svg
                            width={36}
                            height={36}
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M25.875 35.999C23.1906 35.9961 20.6169 34.9284 18.7188 33.0303C16.8206 31.1321 15.7529 28.5584 15.75 25.874C15.7529 23.1896 16.8206 20.6159 18.7188 18.7178C20.6169 16.8196 23.1906 15.7519 25.875 15.749C28.5594 15.7519 31.133 16.8196 33.0312 18.7178C34.9294 20.6159 35.9971 23.1896 36 25.874C35.9971 28.5584 34.9294 31.1321 33.0312 33.0303C31.133 34.9284 28.5594 35.9961 25.875 35.999ZM26.001 24.999C25.7358 24.999 25.4814 25.1043 25.2939 25.2919C25.1063 25.4794 25.001 25.7338 25.001 25.999V29.999C25.001 30.2642 25.1063 30.5186 25.2939 30.7062C25.4814 30.8937 25.7358 30.999 26.001 30.999C26.2662 30.999 26.5205 30.8937 26.7081 30.7062C26.8956 30.5186 27.001 30.2642 27.001 29.999V25.999C27.001 25.7338 26.8956 25.4794 26.7081 25.2919C26.5205 25.1043 26.2662 24.999 26.001 24.999ZM26.001 21.072C25.6488 21.0723 25.3112 21.2123 25.0623 21.4613C24.8133 21.7103 24.6732 22.0479 24.673 22.4C24.6735 22.752 24.8136 23.0894 25.0626 23.3381C25.3115 23.5869 25.649 23.7268 26.001 23.7271C26.3528 23.7268 26.6902 23.5868 26.939 23.338C27.1878 23.0892 27.3277 22.7519 27.328 22.4C27.3277 22.0481 27.1879 21.7106 26.9391 21.4617C26.6903 21.2127 26.3529 21.0726 26.001 21.072ZM14.85 31.499H6.18799C4.54766 31.4972 2.97501 30.8447 1.81512 29.6848C0.655238 28.5249 0.00282929 26.9523 0.000976562 25.312V6.18701C0.00282977 4.54651 0.655388 2.97376 1.81549 1.81384C2.97559 0.653928 4.54847 0.00158807 6.18896 0H25.314C26.9546 0.00158852 28.5277 0.654078 29.6878 1.81421C30.8479 2.97434 31.5004 4.54732 31.502 6.18799V14.85C30.7827 14.482 30.0291 14.1856 29.252 13.965V6.18701C29.2506 5.14326 28.8355 4.14271 28.0974 3.40466C27.3594 2.66662 26.3588 2.25132 25.315 2.25H6.19C5.14608 2.25132 4.1453 2.66665 3.40723 3.40491C2.66915 4.14317 2.25405 5.14406 2.25299 6.18799V25.313C2.25405 26.3571 2.66924 27.3581 3.40753 28.0964C4.14582 28.8347 5.14688 29.2499 6.19098 29.251H13.97C14.1894 30.0279 14.4852 30.7813 14.853 31.5L14.85 31.499ZM8.43799 24.749C7.99073 24.7485 7.56193 24.5705 7.24567 24.2543C6.92941 23.938 6.75151 23.5093 6.75098 23.062C6.75151 22.6146 6.92956 22.1857 7.24603 21.8694C7.56251 21.5531 7.99153 21.3753 8.43896 21.375C8.88657 21.3753 9.31576 21.5532 9.63226 21.8698C9.94877 22.1863 10.1267 22.6154 10.127 23.063C10.1262 23.5101 9.94819 23.9386 9.63196 24.2546C9.31573 24.5707 8.88709 24.7485 8.44 24.749H8.43799ZM16.329 17.999H14.629C14.3307 17.9988 14.0447 17.8801 13.8338 17.6692C13.6229 17.4583 13.5042 17.1723 13.504 16.874C13.5042 16.5757 13.6229 16.2898 13.8338 16.0789C14.0447 15.8679 14.3307 15.7493 14.629 15.749H18.763C17.8558 16.3867 17.0385 17.1435 16.333 17.999H16.329ZM8.43799 17.999C7.99073 17.9985 7.56193 17.8205 7.24567 17.5043C6.92941 17.188 6.75151 16.7593 6.75098 16.312C6.75151 15.8646 6.92956 15.4357 7.24603 15.1194C7.56251 14.8031 7.99153 14.6253 8.43896 14.625C8.88657 14.6253 9.31576 14.8032 9.63226 15.1198C9.94877 15.4363 10.1267 15.8654 10.127 16.313C10.1262 16.7601 9.94819 17.1886 9.63196 17.5046C9.31573 17.8207 8.88709 17.9985 8.44 17.999H8.43799ZM23.626 11.249H14.626C14.3277 11.2488 14.0417 11.1301 13.8307 10.9192C13.6198 10.7083 13.5012 10.4223 13.501 10.124C13.5012 9.82574 13.6198 9.53978 13.8307 9.32886C14.0417 9.11794 14.3277 8.99929 14.626 8.99902H23.626C23.9243 8.99929 24.2103 9.11794 24.4212 9.32886C24.6321 9.53978 24.7507 9.82574 24.751 10.124C24.7507 10.4225 24.632 10.7086 24.4208 10.9196C24.2097 11.1305 23.9244 11.249 23.626 11.249ZM8.43896 11.249C7.99171 11.2485 7.5629 11.0705 7.24664 10.7543C6.93038 10.438 6.75248 10.0093 6.75195 9.56201C6.75248 9.11458 6.93053 8.68567 7.24701 8.36938C7.56348 8.0531 7.99257 7.87526 8.44 7.875C8.88761 7.87527 9.3168 8.05325 9.6333 8.36975C9.9498 8.68625 10.1277 9.11538 10.128 9.56299C10.1272 10.0102 9.94901 10.4389 9.63257 10.755C9.31612 11.0711 8.88726 11.2488 8.44 11.249H8.43896Z"
                                fill="#ECAD42"
                            />
                        </svg>
                    </span>
                    <span>{areas?.table_name}</span>
                </div> */}
                {/* <div className="cardSearchBox">
                    <button className="cardSearchIcon">
                        <svg
                            width={24}
                            height={24}
                            viewBox="0 0 27 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M25.4781 25.034L19.8631 19.409M22.9741 11.89C22.9741 13.9944 22.3501 16.0515 21.1809 17.8013C20.0118 19.551 18.3501 20.9148 16.4058 21.7201C14.4616 22.5254 12.3223 22.7361 10.2583 22.3256C8.19438 21.915 6.29851 20.9016 4.81048 19.4136C3.32245 17.9256 2.30909 16.0297 1.89854 13.9658C1.48799 11.9018 1.6987 9.76245 2.50402 7.81825C3.30933 5.87404 4.67309 4.2123 6.42283 3.04316C8.17257 1.87403 10.2297 1.25 12.3341 1.25C15.156 1.25 17.8623 2.371 19.8577 4.36638C21.8531 6.36177 22.9741 9.0681 22.9741 11.89Z"
                                stroke="#252525"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={searchText}
                        className="form-control"
                        placeholder="Cerca una Norma"
                        onChange={(e)=>setSearchText(e.target.value)}
                    />
                </div>
            </div> */}
            <div className="card-block-body">
                <div className="table-responsive">
                    <table className="table m b-0">
                        <thead className="thbold">
                            <tr>
                                {filteredData?.map((tableHead)=>{
                                    return(
                                        <th>
                                          {tableHead?.table_fields?.field_name}
                                        </th>
                                    )
                                })}
                            </tr>
                            {/* <tr>	
                                <th scope="col">Norma</th>
                                <th scope="col">Tipologia Norma</th>
                                <th scope="col">Descrizione</th>
                                <th scope="col">Codice standard</th>
                                {/* <th scope="col">Descrizione</th> */}
                                {/* <th scope="col">Lingua</th> */}
                                {/* <th scope="col">Ultimo upload</th> */}
                                {/* <th scope="col" /> */}
                            {/* </tr> */} 
                        </thead>
                        <tbody>
                            {data?.data?.map((item,index)=>{
                                return(
                                 <tr>
                                 <td>
                                     <div>
                                         <a className="pdf-file" href={item?.full_url}>
                                            {item?.name}
                                            </a>
                                     </div>
                                 </td>
                                 <td>{item?.language}</td>
                                 <td>{`${item?.standard_types?.type} (${item?.standard_types?.focus})`} </td>
                                 <td>{item?.description}</td>
                                 <td>{item?.standard_code}</td>
                                
                                 <td>
                                     <div className="table_action_list">
                                         <a onClick={() => handleEdit(item?.id_standard)}  className="table_actionBtn">
                                         <img src={editRoute?.table_fields?.label}  />
                                             {/* <svg
                                                 width={26}
                                                 height={26}
                                                 viewBox="0 0 26 26"
                                                 fill="none"
                                                 xmlns="http://www.w3.org/2000/svg"
                                             >
                                                 <path
                                                     d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z"
                                                     stroke="currentcolor"
                                                     strokeWidth="1.5"
                                                     strokeLinecap="round"
                                                     strokeLinejoin="round"
                                                 />
                                                 <path
                                                     d="M10.188 4.83984L4.43103 10.0088"
                                                     stroke="currentcolor"
                                                     strokeWidth="1.5"
                                                 />
                                             </svg> */}
                                         </a>
                                         <a onClick={()=>handleModal(item?.id_standard)} className="table_actionBtn">
                                         <img src={deleteRoute?.table_fields?.label}  />
                                             {/* <svg
                                                 width={26}
                                                 height={25}
                                                 viewBox="0 0 26 25"
                                                 fill="none"
                                                 xmlns="http://www.w3.org/2000/svg"
                                             >
                                                 <path
                                                     d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                                     stroke="currentcolor"
                                                     strokeWidth="1.5"
                                                     strokeLinecap="round"
                                                     strokeLinejoin="round"
                                                 />
                                             </svg> */}
                                         </a>
                                     </div>
                                 </td>
                             </tr>
                              )
                            })}
                            {/* <tr>
                                <td>
                                    <div className="pdf-file">
                                        <a href="#!">CEI EN 11-27-2014_ITA</a>
                                    </div>
                                </td>
                                <td>Norma di tipo A</td>
                                <td>Lavori su impianti elettrici</td>
                                <td>ITA</td>
                                <td>00/00/0000</td>
                                <td>
                                    <div className="table_action_list">
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={26}
                                                viewBox="0 0 26 26"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10.188 4.83984L4.43103 10.0088"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        </a>
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={25}
                                                viewBox="0 0 26 25"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="pdf-file">
                                        <a href="#!">CEI EN 11-27-2014_ITA</a>
                                    </div>
                                </td>
                                <td>Norma di tipo A</td>
                                <td>Lavori su impianti elettrici</td>
                                <td>ITA</td>
                                <td>00/00/0000</td>
                                <td>
                                    <div className="table_action_list">
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={26}
                                                viewBox="0 0 26 26"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10.188 4.83984L4.43103 10.0088"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        </a>
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={25}
                                                viewBox="0 0 26 25"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="pdf-file">
                                        <a href="#!">CEI EN 11-27-2014_ITA</a>
                                    </div>
                                </td>
                                <td>Norma di tipo A</td>
                                <td>Lavori su impianti elettrici</td>
                                <td>ITA</td>
                                <td>00/00/0000</td>
                                <td>
                                    <div className="table_action_list">
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={26}
                                                viewBox="0 0 26 26"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10.188 4.83984L4.43103 10.0088"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        </a>
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={25}
                                                viewBox="0 0 26 25"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="pdf-file">
                                        <a href="#!">CEI EN 11-27-2014_ITA</a>
                                    </div>
                                </td>
                                <td>Norma di tipo A</td>
                                <td>Lavori su impianti elettrici</td>
                                <td>ITA</td>
                                <td>00/00/0000</td>
                                <td>
                                    <div className="table_action_list">
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={26}
                                                viewBox="0 0 26 26"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10.188 4.83984L4.43103 10.0088"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        </a>
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={25}
                                                viewBox="0 0 26 25"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="pdf-file">
                                        <a href="#!">CEI EN 11-27-2014_ITA</a>
                                    </div>
                                </td>
                                <td>Norma di tipo A</td>
                                <td>Lavori su impianti elettrici</td>
                                <td>ITA</td>
                                <td>00/00/0000</td>
                                <td>
                                    <div className="table_action_list">
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={26}
                                                viewBox="0 0 26 26"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10.188 4.83984L4.43103 10.0088"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        </a>
                                        <a href="#!" className="table_actionBtn">
                                            <svg
                                                width={26}
                                                height={25}
                                                viewBox="0 0 26 25"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                                    stroke="currentcolor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
            <div className="modal-main-box">
                 <div className="modal-inner-box" ref={modalRef}>
                    {/* <span className="info-iocn">
                        !
                    </span> */}
                    {findAreaByKeyPrefix("FormArea8")}
                   {findAreaByKeyPrefix("FormArea9")}
                   {findAreaByKeyPrefix("FormArea10")}
                    <div className="modal-btn-group">
                        {findAreaByKeyPrefix("FormArea11",{handleDeleteNorme})}
                        {findAreaByKeyPrefix("FormArea12",{setShowModal})}
                   </div>
                   
                </div>
            </div>
            )}
           
        </>
    )
}

export default NormaElement2