import React from 'react'

function InputNumberElement({ areas, handleChange, formValues, errors }) {
  return (

    <div className="col-md-6">
      <div className="form-floating">
        <input
          type="number"
          className={`form-control ${errors.year ? 'is-invalid' : ''}`}
          id="floatingInput"
          name="year"
          value={formValues?.year}
          placeholder={areas?.element_data?.block_name}
          onChange={handleChange}
        />
        <label htmlFor="floatingInput">{areas?.element_data?.block_name}</label>
        {errors.year && <div className="invalid-feedback">{errors.year}</div>}
      </div>
    </div>
  )
}

export default InputNumberElement




