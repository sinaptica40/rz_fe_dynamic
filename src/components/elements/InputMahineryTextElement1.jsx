import React from 'react'

function InputMahineryTextElement1({areas,handleChange,errors,formValues}) {
  return (
    <>
            <input
                type="text"
                className={`form-control ${errors.typology ? 'is-invalid' : ''}`}
                id="floatingInput"
                name="typology"
                value={formValues?.typology}
                placeholder={areas?.element_data?.block_name}
              //  defaultValue={`Inserire ${areas?.element_data?.block_name}`}
                onChange={handleChange}
            />
            <label htmlFor="floatingInput">{areas?.element_data?.block_name}</label>
            {errors.typology && <div className="invalid-feedback">{errors.typology}</div>}
        </>
  )
}

export default InputMahineryTextElement1  


