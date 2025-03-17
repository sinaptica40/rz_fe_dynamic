import React from "react";


const PdfDownloadElement = ({ areas, formValues }) => {
    const { element_data } = areas;
    return (
        <div className="form-group">
            <a href={formValues?.full_url}>
                <img src={element_data?.data?.html_name} />
            <span style={{ paddingLeft: "10px" }}>
                {formValues?.file ? formValues?.file?.name : formValues?.fileName ? formValues?.fileName : "No file chosen"}
            </span>
            </a>
        </div>
    )
}

export default PdfDownloadElement;

