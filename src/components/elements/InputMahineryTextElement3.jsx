import React from 'react'

function InputMahineryTextElement3({areas,errors,handleChange,formValues}) {
  return (
 
   <div className="col-md-4">
    <div className="form-floating">
            <input
                type="text"
                className={`form-control ${errors.brand_name ? 'is-invalid' : ''}`}
                id="floatingInput"
                name="brand_name"
                value={formValues?.brand_name}
                placeholder={areas?.element_data?.block_name}
              //  defaultValue={`Inserire ${areas?.element_data?.block_name}`}
                onChange={handleChange}
            />
            <label htmlFor="floatingInput">{areas?.element_data?.block_name}</label>
            {errors.brand_name && <div className="invalid-feedback">{errors.brand_name}</div>}
            </div>
            </div>
        
  )
}

export default InputMahineryTextElement3



