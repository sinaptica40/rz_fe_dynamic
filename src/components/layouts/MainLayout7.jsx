import React from "react";

const MainLayout6 = ({ areas }) => {
    console.warn('==MainLayout777=areas==', areas);

    // Helper function to find area by key prefix (e.g., 'HeaderArea1')
    const findAreaByKeyPrefix = (prefix) => areas.find(area => area.key && area.key.startsWith(prefix));

    return (
        <>
            <div className="loader-wrapper" style={{ display: "none" }}>
                <div className="loader">
                    <img src="img/logo.png" alt="" />
                </div>
            </div>
            {/* Back to Top */}
            <div className="progress-wrap cursor-pointer">
                <svg
                    className="arrowTop"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8.99996 15.9999H6.99996V3.99991L1.49996 9.49991L0.0799561 8.07991L7.99996 0.159912L15.92 8.07991L14.5 9.49991L8.99996 3.99991V15.9999Z"
                        fill="black"
                    />
                </svg>
                <svg
                    className="progress-circle svg-content"
                    width="100%"
                    height="100%"
                    viewBox="-1 -1 102 102"
                >
                    <path
                        d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                        style={{
                            transition: "stroke-dashoffset 10ms linear 0s",
                            strokeDasharray: "307.919, 307.919",
                            strokeDashoffset: "307.919"
                        }}
                    ></path>
                </svg>
            </div>
            {/* Header */}
            <header id="header">
                <div className="container-fluid px-0">
                    <div className="row">
                        <div className="col-12">
                            <nav className="navbar navbar-expand-lg">
                                {findAreaByKeyPrefix('HeaderArea1') || <div>- -</div>}
                                <div className="overlay" style={{ display: "none" }} />
                                {findAreaByKeyPrefix('HeaderArea2') || <div>- -</div>}
                                {findAreaByKeyPrefix('HeaderArea3') || <div>- -</div>}
                                {findAreaByKeyPrefix('HeaderArea4') || <div>- -</div>}
                                <button className="navbar-toggler" type="button">
                                    <span className="navbar-toggler-icon" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            {/* <div className="webcontent-wrapper">
                <div className="container-fluid p-0">
                    <div className="cards-block">
                        <div className="card-header add-form-header">
                            {/* {findAreaByKeyPrefix('EditArea1') || <div>- -</div>} 
                            <div className="card-title">
                                <span className="title-icon">
                                    {findAreaByKeyPrefix('EditArea1') || <div>- -</div>}
                                </span>
                                <span>{findAreaByKeyPrefix('EditArea2') || <div>- -</div>}</span>
                            </div>
                            {findAreaByKeyPrefix('EditArea3') || <div>- -</div>}
                            {findAreaByKeyPrefix('EditArea4') || <div>- -</div>}

                        </div>
                        {/* <a href="#!" className="close-iconBtn">
                            <svg
                                width={26}
                                height={26}
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
                        {findAreaByKeyPrefix('EditArea5') || <div>- -</div>}
                        <div className="form-input-block">
                            <form action="#!">
                                <div className="row row-gap">
                                    {findAreaByKeyPrefix('EditArea6') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea7') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea8') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea9') || <div>- -</div>}
                                </div>
                            </form>
                            <div className="col-md-12">
                                <div className="form-btn-sets">
                                    {findAreaByKeyPrefix('EditButtonArea1') || <div>- -</div>}
                                    <div className="btn-set-right">
                                        {findAreaByKeyPrefix('EditButtonArea2') || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditButtonArea3') || <div>- -</div>}

                                    </div>
                                </div>
                            </div>
                            <div className="new-added">
                                <div className="itemTitle">Inspection Item 1</div>
                                <div className="row row-gap">
                                    {findAreaByKeyPrefix('EditArea9') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea10') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea11') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea12') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea13') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea14') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea15') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea16') || <div>- -</div>}
                                    <div className="col-md-4">
                                        <div className="form-custom-check inline-check ccmt-50">
                                            {findAreaByKeyPrefix('EditCheckArea1') || <div>- -</div>}
                                            {findAreaByKeyPrefix('EditCheckArea2') || <div>- -</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {findAreaByKeyPrefix('EditTitleArea') || <div>- -</div>}
                            <div className="table-responsive">
                                <table className="table m b-0">
                                    {findAreaByKeyPrefix('EditTableArea') || <div>- -</div>}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="webcontent-wrapper">
                <div className="container-fluid p-0">
                    <div className="cards-block">
                        <div className="card-header add-form-header">
                            <div className="card-title">
                                {findAreaByKeyPrefix('FormArea7') || <div>- -</div>}
                                {findAreaByKeyPrefix('FormArea8') || <div>- -</div>}
                            </div>
                            <div className="ispezione-detaBox">
                                {findAreaByKeyPrefix('EditArea1') || <div>- -</div>}
                                {findAreaByKeyPrefix('EditArea2') || <div>- -</div>}

                            </div>
                            {findAreaByKeyPrefix('EditArea3') || <div>- -</div>}

                        </div>
                        {findAreaByKeyPrefix('EditArea4') || <div>- -</div>}

                        <div className="form-input-block">
                            <form action="#!">
                                <div className="row row-gap">
                                    {findAreaByKeyPrefix('EditArea5') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea6') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea7') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea8') || <div>- -</div>}
                                </div>
                            </form>
                            <div className="col-md-12">
                                <div className="form-btn-sets">
                                    <div className="btn-set-left">
                                        {findAreaByKeyPrefix('EditButtonArea0') || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditButtonArea1') || <div>- -</div>}
                                    </div>
                                    <div className="btn-set-right">
                                        {findAreaByKeyPrefix('EditButtonArea2') || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditButtonArea3') || <div>- -</div>}
                                    </div>
                                </div>
                                {/* form-btn-sets END */}
                            </div>
                            {/* Add Element */}
                            <div className="new-added">
                                {findAreaByKeyPrefix('EditArea9') || <div>- -</div>}

                                <div className="row row-gap">
                                    {findAreaByKeyPrefix('EditArea10') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea11') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea12') || <div>- -</div>}


                                    {findAreaByKeyPrefix('EditArea13') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea14') || <div>- -</div>}

                                    {findAreaByKeyPrefix('EditArea15') || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea16') || <div>- -</div>}

                                    {findAreaByKeyPrefix('EditArea17') || <div>- -</div>}

                                    <div className="col-md-4">
                                        <div className="form-custom-check inline-check ccmt-50">
                                            {findAreaByKeyPrefix('EditCheckArea1') || <div>- -</div>}
                                            {findAreaByKeyPrefix('EditCheckArea2') || <div>- -</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Add Element End */}
                            {/* Added Elements Table */}

                            {findAreaByKeyPrefix('EditTableArea') || <div>- -</div>}

                            {/* <div className="heading-bg-element">
                                <div className="heading-elm-itle">
                                    Elementi di ispezione pianificati
                                </div>
                            </div> */}
                            {/* <div className="table-responsive">
                                <table className="table m b-0">
                                    <thead className="thbold">
                                        <tr>
                                            <th scope="col">Macchinario</th>
                                            <th scope="col">Ispettore</th>
                                            <th scope="col">Area Lavoro</th>
                                            <th scope="col">Data Ispezione</th>
                                            <th scope="col" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Pellizzatore</td>
                                            <td>Mario Rossi</td>
                                            <td>Area Lavoro x</td>
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
                                    </tbody>
                                </table>
                            </div> */}
                            {/* Added Elements Table END*/}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default MainLayout6;
