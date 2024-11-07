import React from "react";

const EditElement3 = () => {
    return (
        <>
            <span className="drop-statusText">Status</span>
            <div className="dropdown">
                <button
                    className="action-btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    In pianificazione
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                        <a className="dropdown-item buleColor" href="#">
                            Action
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item greenColor" href="#">
                            Another action
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item yellowColor" href="#">
                            Something else here
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item redColor" href="#">
                            Separated link
                        </a>
                    </li>
                </ul>
            </div>
        </>
    )
}
export default EditElement3