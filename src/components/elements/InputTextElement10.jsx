const InputTextElement10 = ({areas})=>{
    return (
        <>
        <input
                type="text"
                className="form-control"
                id="floatingInput"
               // value={clientformData?.created_by}
                // placeholder={areas?.element_data.block_name}
                // onChange={handleChange}
                name="standard_code"
                //defaultValue={`Inserire ${element_data.block_name}`}
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
            </>
    )

}

export default InputTextElement10;