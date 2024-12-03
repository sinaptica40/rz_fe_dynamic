import React from 'react'

function LinguaDropDownElement({areas,languageData,formValues,handleChange}) {
  const name = areas?.element_data?.block_name;

  return (
    <div className="col-md-4">
    <div className="form-floating">
    <select
   // className={`form-select form-control ${errors.language ? 'is-invalid' : ''}`}
   className="form-select form-control"
    id="floatingSelectNormeBase"
    name="language"
    value={formValues.language}
    onChange={handleChange}
    aria-label="Floating label select example"
  >
  {/* <option value=""> Select Lingua</option> */}
    {languageData?.data.map((item)=>(
       <option value={item.name} selected>{item.name}</option>
    ))}
      {/* <option value='EN' selected>EN</option>
      <option value='IT'>IT</option> */}
   
  </select>
  <label htmlFor="floatingSelectNormeBase">{name}</label>
  </div>
  </div>
  )
}

export default LinguaDropDownElement