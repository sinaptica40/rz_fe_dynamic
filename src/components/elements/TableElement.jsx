import moment from "moment";
import React from "react";

const TableElement = ({ areas, reports }) => {
    const tableHeading = areas?.table_columns;
    return (
      <>
        <div className="card-header nowrap-mobile">
          <div className="card-title">
            <span className="title-icon">
              <svg
                width={26}
                height={29}
                viewBox="0 0 26 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.50005 28.7102C3.38614 28.7102 2.31785 28.2677 1.5302 27.4801C0.742548 26.6924 0.300049 25.6241 0.300049 24.5102V4.89922C0.300049 3.78531 0.742548 2.71702 1.5302 1.92937C2.31785 1.14172 3.38614 0.699219 4.50005 0.699219H15.947C17.0608 0.699669 18.1287 1.14246 18.916 1.93022L24.28 7.29122C24.6702 7.68137 24.9796 8.14457 25.1906 8.65435C25.4017 9.16412 25.5102 9.71048 25.51 10.2622V24.5082C25.51 25.6221 25.0676 26.6904 24.2799 27.4781C23.4922 28.2657 22.424 28.7082 21.31 28.7082L4.50005 28.7102ZM3.10005 24.5102C3.10005 24.8815 3.24755 25.2376 3.5101 25.5002C3.77265 25.7627 4.12875 25.9102 4.50005 25.9102H21.308C21.6794 25.9102 22.0354 25.7627 22.298 25.5002C22.5605 25.2376 22.708 24.8815 22.708 24.5102V11.8992H18.508C17.3941 11.8992 16.3259 11.4567 15.5382 10.6691C14.7505 9.88141 14.308 8.81313 14.308 7.69922V3.49922H4.50005C4.12875 3.49922 3.77265 3.64672 3.5101 3.90927C3.24755 4.17182 3.10005 4.52792 3.10005 4.89922V24.5102ZM18.507 9.09922H22.129L17.106 4.08022V7.69922C17.106 7.88315 17.1423 8.06529 17.2127 8.23521C17.2831 8.40513 17.3863 8.55951 17.5165 8.68952C17.6466 8.81954 17.801 8.92264 17.971 8.99294C18.141 9.06324 18.3231 9.09935 18.507 9.09922ZM18.507 16.0992C18.507 15.7279 18.3595 15.3718 18.097 15.1093C17.8344 14.8467 17.4784 14.6992 17.107 14.6992C16.7357 14.6992 16.3797 14.8467 16.1171 15.1093C15.8545 15.3718 15.707 15.7279 15.707 16.0992V21.6992C15.707 22.0705 15.8545 22.4266 16.1171 22.6892C16.3797 22.9517 16.7357 23.0992 17.107 23.0992C17.4784 23.0992 17.8344 22.9517 18.097 22.6892C18.3595 22.4266 18.507 22.0705 18.507 21.6992V16.0992ZM14.307 18.8992C14.307 18.5279 14.1595 18.1718 13.897 17.9093C13.6344 17.6467 13.2784 17.4992 12.907 17.4992C12.5357 17.4992 12.1797 17.6467 11.9171 17.9093C11.6545 18.1718 11.507 18.5279 11.507 18.8992V21.6992C11.507 22.0705 11.6545 22.4266 11.9171 22.6892C12.1797 22.9517 12.5357 23.0992 12.907 23.0992C13.2784 23.0992 13.6344 22.9517 13.897 22.6892C14.1595 22.4266 14.307 22.0705 14.307 21.6992V18.8992ZM8.70705 20.2992C8.33574 20.2992 7.97965 20.4467 7.7171 20.7093C7.45455 20.9718 7.30705 21.3279 7.30705 21.6992C7.30705 22.0705 7.45455 22.4266 7.7171 22.6892C7.97965 22.9517 8.33574 23.0992 8.70705 23.0992H8.72105C9.09235 23.0992 9.44845 22.9517 9.711 22.6892C9.97355 22.4266 10.121 22.0705 10.121 21.6992C10.121 21.3279 9.97355 20.9718 9.711 20.7093C9.44845 20.4467 9.09235 20.2992 8.72105 20.2992H8.70705Z"
                  fill="#ECAD42"
                />
              </svg>
            </span>
            <span>{areas?.table_name}</span>
          </div>
        </div>
        <div className="card-block-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {tableHeading?.map((item) => (
                    <th scope="col">{item?.table_fields?.field_name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports?.data?.length > 0 ? (
                  reports?.data?.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.id_order}</td>
                      <td>{item?.order_code}</td>
                      <td>{moment(item?.time).format("YYYY-MM-DD")}</td>
                      <td>
                        <div className="download-icon">
                          <a
                            href={item?.report_full_url}
                            download={`${item?.report_name}${moment(
                              item?.time
                            ).format("YYYY-MM-DD")}`}
                          >
                            <svg
                              width="23"
                              height="22"
                              viewBox="0 0 23 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.446 14.1522V1.61719M11.446 14.1522L7.268 9.97419M11.446 14.1522L15.624 9.97419M1 16.2412L1.649 18.8412C1.76317 19.2919 2.02443 19.6916 2.3914 19.9771C2.75837 20.2625 3.21008 20.4174 3.675 20.4172H19.217C19.6827 20.4171 20.1351 20.2613 20.5021 19.9747C20.8692 19.6881 21.13 19.287 21.243 18.8352L21.892 16.2352"
                                stroke="#ECAD42"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <div></div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
};

export default TableElement;
