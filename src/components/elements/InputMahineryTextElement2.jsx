import React from 'react'

function InputMahineryTextElement2({ areas, handleChange, errors, formValues }) {
  return (

    <div className="col-md-6">
      <div
        className="form-floating"
      >
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="floatingInput"
          name="name"
          value={formValues?.name}
          placeholder={areas?.element_data?.block_name}
          onChange={handleChange}
        />
        <label htmlFor="floatingInput">{areas?.element_data?.block_name}</label>
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
    </div>
  )
}

export default InputMahineryTextElement2