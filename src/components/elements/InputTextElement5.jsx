const InputTextElement5 = ({areas,value,label})=>{
    return(
         <>
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={value}
                name={label}
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
         </>
    )
}

export default InputTextElement5;