import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const inputTextElement7 = ({ areas, clientformData, handleDateChange, isSelectActive, errorsForm1 }) => {
    return (
        <>
            <div className={`form-floating ${isSelectActive ? "active-floating-select" : ""}`}>
                <DatePicker
                    name="date"
                    selected={clientformData?.date}
                    onChange={(date) => handleDateChange(date)}
                    placeholderText=""
                    dateFormat="MMMM d, yyyy"
                    isClearable
                    popperPlacement="bottom-start"
                    className='form-control'
                    minDate={moment().startOf('day').toDate()}
                />
                <label
                >{areas?.element_data.block_name}</label>
                {errorsForm1?.date && (
                    <div className="text-danger mt-2">{errorsForm1?.date}</div>
                )}
            </div>
        </>
    )
}

export default inputTextElement7;