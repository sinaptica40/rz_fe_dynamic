import React from 'react'

function InputDescriptionElement({ areas, handleChange, errors, formValues, editNormeData }) {
  console.log(errors,'check validation');
  return (
    <div className="col-md-12">
      <div className="form-floating">
        <input
          type="text"
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="floatingInput"
          name="description"
          value={formValues?.description}
          placeholder={areas?.element_data?.block_name}
          onChange={handleChange}
        />
        <label htmlFor="floatingInput">{areas?.element_data?.block_name}</label>
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>
    </div>
  )
}

export default InputDescriptionElement