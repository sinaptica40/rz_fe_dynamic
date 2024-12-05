import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';


const MachineryElement2 = ({ areas, data: machineryData, showModal, handleModal,modalRef, handleDeleteNorme, setShowModal, nestedElements }) => {

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



    const navigate = useNavigate();

    const filteredData = areas?.table_columns
        .filter(item => item.table_fields.data_type !== "api");

    console.warn("table_column_machinery", areas?.table_columns)

    const editRoute = areas?.table_columns.filter(item => item.table_fields.data_type == "api");

    const editIcon = areas?.table_columns.find(item => item.table_fields.field_name == "/edito-macchinari");
    const deleteRoute = areas?.table_columns.find(item => item.table_fields.field_name == "Delete-macchinari");



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
        navigate(getapi.editMachinery)
    };
    return (
        <>

            {/* <div className="card-header border-0 add-form-header pb-0">
                <div className="card-title">
                    <span className="title-icon">
                        <svg
                            width={41}
                            height={39}
                            viewBox="0 0 41 39"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6.18805 0H25.313C26.9542 0 28.5281 0.651903 29.6886 1.81238C30.8491 2.97285 31.501 4.54683 31.501 6.18799V14.85C30.7819 14.4822 30.0282 14.186 29.251 13.9659V6.18799C29.251 5.14383 28.8362 4.14251 28.0979 3.40417C27.3596 2.66584 26.3582 2.25098 25.314 2.25098H6.18903C5.67193 2.25098 5.15991 2.35287 4.68219 2.55078C4.20447 2.7487 3.77038 3.03873 3.40479 3.40442C3.03919 3.77011 2.74925 4.20435 2.55145 4.68213C2.35366 5.1599 2.25188 5.67187 2.25201 6.18896V25.314C2.25228 26.3583 2.6673 27.3598 3.40576 28.0983C4.14422 28.8367 5.14572 29.2517 6.19006 29.252H13.968C14.1873 30.0294 14.4835 30.7831 14.8521 31.502H6.19006C4.54917 31.502 2.97547 30.8501 1.81519 29.6898C0.654899 28.5295 0.00305249 26.9558 0.00305249 25.3149V6.18994C0.00265844 5.37737 0.162338 4.57276 0.472962 3.8219C0.783587 3.07104 1.23907 2.38865 1.81342 1.81384C2.38776 1.23904 3.06971 0.783033 3.82031 0.471802C4.57092 0.160571 5.37548 0.000262575 6.18805 0ZM14.626 15.75H18.759C17.8521 16.388 17.0348 17.1447 16.329 18H14.629C14.3307 18 14.0445 17.8815 13.8336 17.6705C13.6226 17.4596 13.504 17.1734 13.504 16.875C13.504 16.5773 13.622 16.2918 13.8322 16.0809C14.0423 15.8701 14.3284 15.7511 14.626 15.75ZM8.43903 11.25C8.88654 11.25 9.31573 11.0723 9.63226 10.756C9.9488 10.4396 10.1267 10.0105 10.127 9.56299C10.1267 9.11565 9.94895 8.68668 9.63263 8.37036C9.31631 8.05404 8.8874 7.87624 8.44006 7.87598C8.21844 7.87598 7.99899 7.91967 7.79425 8.00452C7.58951 8.08936 7.40349 8.21373 7.24683 8.37048C7.09016 8.52724 6.96589 8.7133 6.88117 8.91809C6.79644 9.12288 6.75292 9.34234 6.75305 9.56396C6.75332 10.0112 6.93115 10.4401 7.2475 10.7562C7.56384 11.0724 7.99282 11.25 8.44006 11.25H8.43903ZM10.127 16.313C10.1267 16.7603 9.94895 17.1893 9.63263 17.5056C9.31631 17.8219 8.8874 17.9997 8.44006 18C7.99264 18 7.56351 17.8222 7.24713 17.5059C6.93076 17.1895 6.75305 16.7604 6.75305 16.313C6.75305 16.0914 6.79669 15.872 6.88153 15.6672C6.96637 15.4625 7.09074 15.2764 7.2475 15.1198C7.40426 14.9631 7.59038 14.8389 7.79517 14.7542C7.99996 14.6694 8.21942 14.6258 8.44104 14.626C8.88786 14.627 9.31605 14.8052 9.63171 15.1215C9.94738 15.4377 10.1248 15.8662 10.1251 16.313H10.127ZM10.127 23.063C10.127 23.5105 9.94934 23.9397 9.633 24.2562C9.31665 24.5728 8.88758 24.7507 8.44006 24.751C7.99264 24.751 7.56351 24.5732 7.24713 24.2568C6.93076 23.9405 6.75305 23.5114 6.75305 23.064C6.75305 22.8423 6.79669 22.623 6.88153 22.4182C6.96637 22.2135 7.09074 22.0274 7.2475 21.8707C7.40426 21.7141 7.59038 21.5898 7.79517 21.5051C7.99996 21.4204 8.21942 21.3768 8.44104 21.377C8.88769 21.378 9.31571 21.5561 9.63135 21.8721C9.94699 22.1881 10.1245 22.6163 10.1251 23.063H10.127ZM13.502 10.126C13.502 9.82761 13.6206 9.54142 13.8315 9.33044C14.0425 9.11947 14.3286 9.00098 14.627 9.00098H23.627C23.9254 9.00098 24.2116 9.11947 24.4225 9.33044C24.6335 9.54142 24.752 9.82761 24.752 10.126C24.752 10.4243 24.6335 10.7105 24.4225 10.9215C24.2116 11.1325 23.9254 11.251 23.627 11.251H14.627C14.479 11.2512 14.3325 11.2224 14.1957 11.1659C14.0589 11.1094 13.9346 11.0265 13.8299 10.9219C13.7252 10.8173 13.6422 10.693 13.5856 10.5563C13.529 10.4195 13.4999 10.273 13.5001 10.125L13.502 10.126Z"
                                fill="#ECAD42"
                            />
                            <path
                                d="M19.8068 22.4053L19.0778 20.7557C18.9541 20.4766 18.9175 20.1667 18.9729 19.8666C19.0283 19.5664 19.173 19.2899 19.3882 19.0735L20.2664 18.1952C20.4829 17.98 20.7594 17.8353 21.0595 17.7799C21.3597 17.7245 21.6696 17.7611 21.9487 17.8848L23.5983 18.6138L26.0633 17.9492L27.1346 16.4918C27.3164 16.2527 27.5653 16.0732 27.8494 15.9758C28.1336 15.8785 28.4403 15.8678 28.7305 15.9452L29.9107 16.2655C30.2073 16.3425 30.4736 16.5075 30.6744 16.7389C30.8753 16.9703 31.0012 17.2572 31.0357 17.5617L31.2485 19.3414L33.0481 21.141L34.8477 21.3341C35.1522 21.3685 35.439 21.4945 35.6704 21.6953C35.9018 21.8962 36.0669 22.1625 36.1438 22.4591L36.4656 23.6378C36.5429 23.9281 36.5323 24.2347 36.4349 24.5189C36.3376 24.8031 36.158 25.0519 35.919 25.2338L34.4616 26.305L33.7983 28.7686L34.5274 30.4183C34.6511 30.6973 34.6877 31.0072 34.6323 31.3074C34.5769 31.6076 34.4321 31.884 34.217 32.1005L33.3161 33.0013C33.0996 33.2165 32.8232 33.3613 32.523 33.4167C32.2228 33.4721 31.9129 33.4355 31.6339 33.3118L29.9842 32.5827L27.5185 33.2481L26.4473 34.7055C26.2653 34.9437 26.0167 35.1227 25.733 35.2196C25.4493 35.3165 25.1432 35.3271 24.8534 35.2499L23.6747 34.9282C23.3781 34.8513 23.1118 34.6862 22.911 34.4548C22.7101 34.2234 22.5841 33.9365 22.5497 33.6321L22.3347 31.8544L20.5351 30.0548L18.7356 29.8618C18.4311 29.8273 18.1442 29.7014 17.9128 29.5005C17.6814 29.2997 17.5164 29.0334 17.4394 28.7368L17.1177 27.558C17.0403 27.2678 17.051 26.9611 17.1483 26.6769C17.2456 26.3928 17.4252 26.144 17.6643 25.9621L19.1216 24.8908L19.8068 22.4053ZM24.6519 27.7426C25.0763 28.165 25.6164 28.4522 26.2039 28.568C26.7914 28.6837 27.4001 28.6228 27.953 28.3928C28.5059 28.1629 28.9782 27.7743 29.3104 27.2761C29.6427 26.7779 29.8198 26.1924 29.8195 25.5936C29.8192 24.9948 29.6415 24.4095 29.3088 23.9116C28.9761 23.4137 28.5033 23.0256 27.9502 22.7962C27.3971 22.5668 26.7884 22.5065 26.201 22.6228C25.6136 22.7391 25.0738 23.0269 24.6498 23.4497C24.0816 24.018 23.7623 24.7887 23.7623 25.5923C23.7623 26.3959 24.0816 27.1666 24.6498 27.7348L24.6519 27.7426Z"
                                stroke="#ECAD42"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span>{areas?.table_name}</span>
                </div>
                <div className="cardSearchBox">
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
                        value={searchText}
                        type="text"
                        className="form-control"
                        placeholder="Cerca un Macchinario"
                        onChange={(e)=>setSearchText(e.target.value)}
                    />
                </div>
            </div> */}
            <div className="card-block-body">
                <div className="table-responsive">
                    <table className="table m b-0">
                        <thead className="thbold">
                            <tr>
                                {filteredData?.map((table) => (
                                    <th>
                                        {table?.table_fields?.field_name}
                                    </th>
                                ))}
                                {/* <th scope="col">Nome Macchinario</th>
                                <th scope="col">Tipologia Macchinario</th>
                                <th scope="col">Blocco Norma Base</th>
                                <th scope="col">Norma Specifica</th>
                                <th scope="col" /> */}
                            </tr>
                        </thead>
                        <tbody>
                            {machineryData?.data?.map((item, index) => {

                                return (
                                    <tr>
                                        <td>{item?.name}</td>
                                        <td>{item?.typology}</td>
                                        <td>{item?.norm_specification?.length ? item?.norm_specification[0]?.standard_types?.focus : ""}</td>
                                        <td>
                                            {item?.norm_specification?.length > 0 ?
                                                item?.norm_specification?.map(({ pdf_name }) => {
                                                    // Extract the file name without the extension
                                                    const fileNameWithExtension = pdf_name.split('/').pop(); // Get the file name with extension
                                                    const fileName = fileNameWithExtension.split('.').slice(0, -1).join('.'); // Remove the extension

                                                    return (
                                                        <span className="norme-specify mx-1">{fileName}</span>
                                                    );
                                                })
                                                : '-'
                                            }
                                            {/* <span className="norme-specify">
                                            CEI - EN 211-1_2001
                                        </span>
                                        <span className="norme-specify">
                                            UNI - EN 1034-1_2010
                                        </span>
                                        <span className="norme-specify">
                                            UNI - EN 1034-1_2011
                                        </span> */}
                                        </td>
                                        <td>
                                            <div className="table_action_list">
                                                <a
                                                    onClick={() => handleEdit(item?.id_machinery_type)}
                                                    className="table_actionBtn">

                                                    <img src={editIcon?.table_fields?.label} />

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
                                                <a onClick={() => handleModal(item?.id_machinery_type)} className="table_actionBtn">
                                                    <img src={deleteRoute.table_fields?.label} />
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
                                <td>Macchinario 1</td>
                                <td>Tipologia 1</td>
                                <td>Norma di tipo B</td>
                                <td>
                                    <span className="norme-specify">
                                        CEI - EN 211-1_2001
                                    </span>
                                    <span className="norme-specify">
                                        UNI - EN 1034-1_2010
                                    </span>
                                    <span className="norme-specify">
                                        UNI - EN 1034-1_2011
                                    </span>
                                </td>
                                <td>
                                    <div className="table_action_list">
                                        <a 
                                          //onClick={() => handleClick(api?.function_name)}
                                         className="table_actionBtn">
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
                                <td>Macchinario 1</td>
                                <td>Tipologia 1</td>
                                <td>Norma di tipo B</td>
                                <td>
                                    <span className="norme-specify">
                                        CEI - EN 211-1_2001
                                    </span>
                                    <span className="norme-specify">
                                        UNI - EN 1034-1_2010
                                    </span>
                                    <span className="norme-specify">
                                        UNI - EN 1034-1_2011
                                    </span>
                                </td>
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
                                <td>Macchinario 1</td>
                                <td>Tipologia 1</td>
                                <td>Norma di tipo B</td>
                                <td>
                                    <span className="norme-specify">
                                        CEI - EN 211-1_2001
                                    </span>
                                    <span className="norme-specify">
                                        UNI - EN 1034-1_2010
                                    </span>
                                </td>
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
                                <td>Macchinario 1</td>
                                <td>Tipologia 1</td>
                                <td>Norma di tipo B</td>
                                <td>
                                    <span className="norme-specify">
                                        CEI - EN 211-1_2001
                                    </span>
                                    <span className="norme-specify">
                                        UNI - EN 1034-1_2010
                                    </span>
                                    <span className="norme-specify">
                                        UNI - EN 1034-1_2011
                                    </span>
                                </td>
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
                                <td>Macchinario 1</td>
                                <td>Tipologia 1</td>
                                <td>Norma di tipo B</td>
                                <td>
                                    <span className="norme-specify">
                                        CEI - EN 211-1_2001
                                    </span>
                                </td>
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
                <div className="modal-main-box" >
                    <div className="modal-inner-box" ref={modalRef}>
                        {/* <span className="info-iocn">
                            !
                        </span> */}
                       
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

export default MachineryElement2