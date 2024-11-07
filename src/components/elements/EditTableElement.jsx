import React from "react";

const EditTableElement = ({areas}) => {
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
      </div>
    </>
  )
}

export default EditTableElement