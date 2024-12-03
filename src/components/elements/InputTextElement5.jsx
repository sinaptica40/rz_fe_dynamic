const InputTextElement5 = ({areas,value,label})=>{

    console.log("clientformData",value,label)
    return(
         <>
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={value}
                // placeholder={areas?.element_data.block_name}
                // onChange={handleChange}
                name={label}
                //defaultValue={`Inserire ${element_data.block_name}`}
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
         </>
    )
}

export default InputTextElement5;