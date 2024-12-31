
const inputTextElement6 =({areas,clientformData})=>{
    return(
        <>
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={clientformData?.client}
                name="id_order"
                readOnly
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
        </>
    )
}

export default inputTextElement6;