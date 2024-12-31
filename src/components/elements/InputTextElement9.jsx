const InputTextElement9 = ({ areas }) => {
    return (
        <>
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                name="standard_code"
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
        </>
    )

}

export default InputTextElement9;