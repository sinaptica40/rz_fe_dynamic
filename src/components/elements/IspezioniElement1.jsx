import React from "react";
import { useNavigate } from "react-router-dom";
import { getClassColorCode, getClassName } from "../../utils/helper";

const IspezioniElement1 = ({ areas, TableData1 }) => {
  const navigate = useNavigate();

  const filteredData = areas?.table_columns.filter(
    (item) => item.table_fields.data_type !== "api"
  );

  console.log(filteredData,'check column data order')

  const addRoute = areas?.table_columns.find(
    (item) => item.table_fields.data_type === "api"
  );
  const handleAddRoute = (item) => {
    localStorage.setItem("ispenzioEditID", item?.id_order);
    localStorage.setItem(
      "order_Data",
      JSON.stringify({ order_code: item?.order_code, client: item?.client })
    );
    localStorage.setItem(
      "addRoute",
      addRoute?.table_fields?.field_name.split("/").pop()
    );
    navigate(`${addRoute?.table_fields?.field_name}`);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table">
          <thead className="thbold">
            <tr>
              {filteredData?.map((item,index) => (
                <th key={index}>{item?.table_fields?.field_name}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {TableData1?.data?.map((item,index) => (
              <tr key={index}>
                <td>{item?.client}</td>
                <td>{item?.order_code}</td>
                {item?.inspections[0] && (
                  <td>{item?.inspections[0]?.calendar_info?.date}</td>
                )}
                <td>
                  <div className="descTableMax">{item?.description}</div>
                </td>
                {item?.id_state?.state && item?.inspections[0] && (
                  <td>
                    <div className={`complete-label ${getClassName(item?.id_state?.id_state)}`}>
                      <svg
                        width={19}
                        height={19}
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.807 6.74805H11.858C11.756 6.74802 11.6554 6.77231 11.5646 6.81892C11.4738 6.86553 11.3955 6.93311 11.336 7.01605L8.16504 11.416L6.72904 9.42305C6.66942 9.34028 6.59102 9.27284 6.50028 9.22625C6.40954 9.17966 6.30904 9.15526 6.20704 9.15505H5.26104C5.23137 9.15522 5.20232 9.16354 5.17705 9.17909C5.15179 9.19464 5.13128 9.21684 5.11776 9.24325C5.10425 9.26966 5.09824 9.29928 5.10041 9.32887C5.10257 9.35846 5.11282 9.38688 5.13004 9.41105L7.64304 12.896C7.70235 12.979 7.78061 13.0467 7.87131 13.0933C7.96201 13.14 8.06254 13.1643 8.16454 13.1643C8.26654 13.1643 8.36707 13.14 8.45777 13.0933C8.54847 13.0467 8.62673 12.979 8.68604 12.896L12.934 7.00705C12.9523 6.98326 12.9635 6.95484 12.9665 6.925C12.9695 6.89516 12.9641 6.86509 12.9509 6.83816C12.9377 6.81124 12.9172 6.78854 12.8918 6.77261C12.8664 6.75669 12.837 6.74818 12.807 6.74805Z"
                           fill={`${getClassColorCode(item?.id_state?.id_state)}`}
                        />
                        <path
                          d="M9.036 0.919922C7.24885 0.919922 5.50183 1.44987 4.01587 2.44276C2.52991 3.43565 1.37174 4.84688 0.687829 6.49799C0.00391507 8.14911 -0.175028 9.96595 0.173628 11.7188C0.522284 13.4716 1.38288 15.0816 2.64659 16.3453C3.91029 17.609 5.52036 18.4696 7.27317 18.8183C9.02598 19.167 10.8428 18.988 12.4939 18.3041C14.145 17.6202 15.5563 16.462 16.5492 14.9761C17.5421 13.4901 18.072 11.7431 18.072 9.95592C18.072 7.55943 17.12 5.26108 15.4254 3.5665C13.7308 1.87193 11.4325 0.919922 9.036 0.919922ZM9.036 17.4579C7.55264 17.4579 6.1026 17.0181 4.86923 16.1939C3.63586 15.3698 2.67456 14.1985 2.10691 12.828C1.53925 11.4576 1.39073 9.9496 1.68011 8.49474C1.9695 7.03989 2.68381 5.70352 3.7327 4.65462C4.7816 3.60573 6.11797 2.89142 7.57283 2.60203C9.02768 2.31264 10.5357 2.46117 11.9061 3.02883C13.2766 3.59648 14.4479 4.55778 15.272 5.79115C16.0961 7.02451 16.536 8.47456 16.536 9.95792C16.536 10.9428 16.342 11.9181 15.9651 12.828C15.5882 13.738 15.0357 14.5648 14.3393 15.2612C13.6429 15.9577 12.8161 16.5101 11.9061 16.887C10.9962 17.2639 10.0209 17.4579 9.036 17.4579Z"
                           fill={`${getClassColorCode(item?.id_state?.id_state)}`}
                        />
                      </svg>{" "}
                      {item?.id_state?.state}
                    </div>
                  </td>
                )}
                {item?.ispectors?.length > 0 && (
                  <td>
                    {item?.ispectors?.map((item, index) => (
                      <span key={index}>
                        {item}
                        {index < item?.ispectors?.length - 1 && " - "}
                      </span>
                    ))}
                  </td>
                )}
                <td className="text-end">
                  <div className="btnRight">
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAddRoute(item)}
                      className="planRightDete"
                    >
                      <img src={addRoute?.table_fields?.label} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {TableData1?.data?.length === 0 ? (
          <h4 className="text-center my-4" style={{ color: "#ecad42" }}>
            Nessun record trovato
          </h4>
        ) : null}
      </div>
    </>
  );
};
export default IspezioniElement1;
