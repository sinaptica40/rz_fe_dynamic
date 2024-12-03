
const inputTextElement6 =({areas,clientformData})=>{
    return(
        <>
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={clientformData?.client}
                // placeholder={areas?.element_data.block_name}
                // onChange={handleChange}
                name="id_order"
                readOnly
                //defaultValue={`Inserire ${element_data.block_name}`}
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
        </>
    )
}

export default inputTextElement6;