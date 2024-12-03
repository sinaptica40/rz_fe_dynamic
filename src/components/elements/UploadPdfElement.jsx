import React from "react";

const UploadPdfElement = (props) => {
    const {handleChange,errors,formValues}=props;
    console.log("formValues.file ",formValues.file )
    return (
        <>
            
            <div className="form-group">
              <div className="label-text">Carica PDF Norma</div>
              <input
                className={`form-control d-none ${errors.file ? 'is-invalid' : ''}`}
                type="file"
                id="formFile"
                accept=".pdf"
                name="file"
                onChange={handleChange}
              />
              <label htmlFor="formFile" className="upload_image">
                <svg id="Icon_box-upload" data-name="Icon box-upload" xmlns="http://www.w3.org/2000/svg" width="25" height="19" viewBox="0 0 30 24">
                  <path id="Path_1848" data-name="Path 1848" d="M16.5,22.5h3v-9H24L18,6l-6,7.5h4.5Z" transform="translate(-3 -6)" fill="#ecad42" />
                  <path id="Path_1849" data-name="Path 1849" d="M30,27H6V16.5H3V27a3,3,0,0,0,3,3H30a3,3,0,0,0,3-3V16.5H30Z" transform="translate(-3 -6)" fill="#ecad42" />
                </svg>
                <div id="upload-filename">
                  {formValues?.file_name ? formValues?.file_name : formValues?.file ? formValues?.file?.name : "No file chosen"}
                  </div>
              </label>
              {errors.file && <div className="invalid-feedback">{errors.file}</div>}
            </div>
         
        </>
    )
};

export default UploadPdfElement;
