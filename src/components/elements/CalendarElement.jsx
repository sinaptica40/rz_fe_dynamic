import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const css = `
.react-calendar, .react-calendar *, .react-calendar *:before, .react-calendar *:after {
    color: #000;
}
    span.react-calendar__navigation__label__labelText.react-calendar__navigation__label__labelText--from {
    font-weight: 700;
    font-size: 21px;
}
    
    .react-calendar__navigation button {
   font-size: 30px;
    color: #ecad42;
}
    .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
    background-color: transparent;
    color: #000;
}
   .react-calendar {
    width: 100%; 
    border: 0; 
}
    .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus {
    background-color: #fff;
}
    .react-calendar .react-calendar__month-view__days button {
    color: #000;
}
    abbr[title] {
    -webkit-text-decoration: none;
    text-decoration: none;
    cursor: text;
    -webkit-text-decoration-skip-ink: none;
    text-decoration-skip-ink: none;
}
    .react-calendar__month-view__weekdays { 
    text-transform: none; 
    font-size: 14px;
    font-weight: bold; 
}
    .react-calendar__tile--active {
    background: #fff;
    color: #000;
}

.react-calendar__tile {
    padding: 0; 
    min-height: 40px;
}
.react-calendar__tile--now {
    background: #fff;
}
.highlighted-date abbr{
    background: #ecad42;
    color:#000;
    border-radius:50%;
    width:38px;
    height:38px;
        display: block;
    margin: 0 auto;
    line-height: 38px;
     box-sizing: content-box;
}  
.react-calendar__navigation button:nth-child(2){
    flex: auto;
    order: -1;
    width: auto;
    text-align: left;
    background:none;
     justify-content: left;
}
.react-calendar__navigation button {
    min-width: 35px;
    height: 35px;
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    padding: 0 0 4px;
    background-color: #ecad42;
}
.react-calendar__navigation {
    gap: 10px;
    height: 35px;
    align-items: baseline;
    padding: 0 10px;
}
    .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
    background-color: #ecad42;
    color: #fff;
}
.react-calendar__navigation button {
    color: #fff;
}
    .react-calendar__navigation button:nth-child(2):enabled:hover, .react-calendar__navigation button:nth-child(2):enabled:focus {
    background-color:#fff;
}
    @media (max-width: 575.98px) {
  span.react-calendar__navigation__label__labelText.react-calendar__navigation__label__labelText--from {
    font-size: 18px;
  }
  .react-calendar__navigation button {
    font-size: 25px;
  }
  .react-calendar__navigation button {
    min-width: 30px;
    height: 30px;
    width: 30px;
}
.highlighted-date abbr {
    width: 32px;
    height: 32px;
    line-height: 35px;
}
}

`

const CalendarElement = ({ areas, calenderData, showModal, setShowModal, handleModal }) => {
    const [selectedDateData, setSelectedDateData] = useState(null);


    const isHighlightedDate = (date) => {
        if (!calenderData || !calenderData.data) return false;
        return calenderData.data.some((item) => new Date(item.date).toDateString() === date.toDateString());
    };

    const handleDateClick = (date) => {
        const clickedDateData = calenderData.data.find(
            (item) => new Date(item.date).toDateString() === date.toDateString()
        );
        if (clickedDateData) {
            console.log(clickedDateData, 'clickedDateDataclickedDateData')
            setSelectedDateData(clickedDateData);
            setShowModal(true); // Open the modal
            const handleDateClick = (date) => {
                const clickedDateData = calenderData.data.find(
                    (item) => new Date(item.date).toDateString() === date.toDateString()
                );
                if (clickedDateData) {
                    console.log(clickedDateData, 'clickedDateDataclickedDateData')
                    setSelectedDateData(clickedDateData);
                    console.log("selectedDate", selectedDateData)
                    setShowModal(true); // Open the modal
                    handleModal(clickedDateData);

                }

            };
        }

    };

    return (
        <>
            <div className="card-header nowrap-mobile">
                <style>{css}</style>
                <div className="card-title">
                    <span className="title-icon">
                        <svg
                            width={26}
                            height={27}
                            viewBox="0 0 26 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.655 0.572266C5.8693 0.572266 6.07481 0.657394 6.22634 0.808923C6.37787 0.960453 6.463 1.16597 6.463 1.38027V2.18827H19.39V1.38027C19.39 1.16597 19.4751 0.960453 19.6267 0.808923C19.7782 0.657394 19.9837 0.572266 20.198 0.572266C20.4123 0.572266 20.6178 0.657394 20.7693 0.808923C20.9209 0.960453 21.006 1.16597 21.006 1.38027V2.18827H22.622C23.0464 2.18827 23.4667 2.27186 23.8588 2.43429C24.251 2.59671 24.6073 2.83478 24.9074 3.1349C25.2075 3.43502 25.4456 3.79131 25.608 4.18343C25.7704 4.57556 25.854 4.99583 25.854 5.42027V23.1943C25.854 24.0514 25.5135 24.8735 24.9074 25.4796C24.3013 26.0858 23.4792 26.4263 22.622 26.4263H3.232C2.37482 26.4263 1.55275 26.0858 0.946631 25.4796C0.340513 24.8735 0 24.0514 0 23.1943L0 5.42027C0 4.56309 0.340513 3.74101 0.946631 3.1349C1.55275 2.52878 2.37482 2.18827 3.232 2.18827H4.848V1.38027C4.848 1.16614 4.93299 0.960777 5.0843 0.809277C5.23562 0.657776 5.44088 0.572531 5.655 0.572266ZM1.616 7.03527V23.1943C1.616 23.6229 1.78626 24.0339 2.08932 24.337C2.39237 24.64 2.80341 24.8103 3.232 24.8103H22.622C23.0506 24.8103 23.4616 24.64 23.7647 24.337C24.0677 24.0339 24.238 23.6229 24.238 23.1943V7.03527H1.616Z"
                                fill="#ECAD42"
                            />
                        </svg>
                    </span>
                    <span>{areas?.table_name}</span>
                </div>
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-secondary dropdown-toggle custom-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span className="toggle-ellipse">
                            <svg
                                width={6}
                                height={28}
                                viewBox="0 0 6 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.500023 2.88719C0.500023 3.33615 0.633157 3.77503 0.882587 4.14833C1.13202 4.52163 1.48654 4.81258 1.90133 4.98439C2.31612 5.15621 2.77254 5.20116 3.21288 5.11357C3.65321 5.02598 4.05769 4.80978 4.37515 4.49232C4.69262 4.17485 4.90882 3.77038 4.9964 3.33004C5.08399 2.88971 5.03904 2.43328 4.86723 2.0185C4.69542 1.60371 4.40447 1.24918 4.03117 0.999752C3.65787 0.750321 3.21899 0.617187 2.77002 0.617188C2.16798 0.617188 1.5906 0.856348 1.16489 1.28206C0.739183 1.70776 0.500023 2.28515 0.500023 2.88719ZM0.500023 14.2372C0.500418 14.6861 0.633913 15.1248 0.883629 15.4979C1.13334 15.8709 1.48807 16.1616 1.90295 16.3331C2.31783 16.5045 2.77424 16.5491 3.21447 16.4613C3.6547 16.3734 4.05899 16.1569 4.37621 15.8393C4.69344 15.5216 4.90936 15.117 4.99667 14.6767C5.08399 14.2363 5.03877 13.78 4.86675 13.3653C4.69473 12.9507 4.40362 12.5963 4.03023 12.3471C3.65684 12.0979 3.21794 11.965 2.76902 11.9652C2.16698 11.9652 1.5896 12.2043 1.16389 12.6301C0.738183 13.0558 0.499023 13.6331 0.499023 14.2352L0.500023 14.2372ZM0.500023 25.5872C0.500023 26.0361 0.633157 26.475 0.882587 26.8483C1.13202 27.2216 1.48654 27.5126 1.90133 27.6844C2.31612 27.8562 2.77254 27.9012 3.21288 27.8136C3.65321 27.726 4.05769 27.5098 4.37515 27.1923C4.69262 26.8749 4.90882 26.4704 4.9964 26.03C5.08399 25.5897 5.03904 25.1333 4.86723 24.7185C4.69542 24.3037 4.40447 23.9492 4.03117 23.6998C3.65787 23.4503 3.21899 23.3172 2.77002 23.3172C2.16798 23.3172 1.5906 23.5563 1.16489 23.9821C0.739183 24.4078 0.500023 24.9851 0.500023 25.5872Z"
                                    fill="#9B9696"
                                />
                            </svg>
                        </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end custom-dropmenu">
                        <li>
                            <a className="dropdown-item" href="#!">
                                Action 1
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#!">
                                Action 2
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#!">
                                Action 3
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card-block-body">
                <div className="calender text-center">
                    <Calendar
                        prev2Label={null}  // Hide the previous year button
                        next2Label={null}  // Hide the next year button
                        tileClassName={({ date, view }) => {
                            if (view === 'month' && isHighlightedDate(date)) {
                                return 'highlighted-date';
                            }
                            return null;
                        }}
                        onClickDay={handleDateClick} // Handle clicking on a date
                    />
                </div>
            </div>
            {showModal && selectedDateData && (
                <div className="modal-main-box date_modalCustome">
                    <div className="modal-inner-box">
                        <div className="heading-bg-element">
                            <div className="modal-header p-0 heading-bg-element">
                                <h5 className="modal-title text-start">Ispezioni programmate attivate{selectedDateData.date}</h5>
                                <button type="button" onClick={() => setShowModal(false)} class="btn-close text-white"></button>
                            </div>
                        </div>
                        <div className="modal_inner_body">
                            <div className="table-responsive">
                                <table className="table m b-0">
                                    <thead className="thbold">
                                        <tr>
                                            <th scope="col">ID Ispezione</th>
                                            <th scope="col">ID Codice</th>
                                            <th scope="col">Descrizione</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Dettagli</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedDateData?.order?.map((item) => (
                                            <tr key={item.id_order}>
                                                <th>{item.client_name}</th>
                                                <th>{item.order_code}</th>
                                                <th>{item.description}</th>
                                                <th>{item.state?.name}</th>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                    </div>
                    </div>
                </div>
            )}
        </>

    )
};

export default CalendarElement;
