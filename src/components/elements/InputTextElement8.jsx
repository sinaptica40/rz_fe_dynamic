const inputTextElement8 = ({ areas, formValues, formName,handleNotes,formData }) => {
    const handleInputChange = (e) => {
        handleNotes(e);  // You can also handle additional logic if needed.
      };

    return (
         
          <>
            <input
              name={`${formName?.name}`}
              type="text"
              className="form-control"
              id="floatingInput"
              onChange={formData ? handleInputChange : null}
              value={formValues}
              //readOnly
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
          </>
    
    );
  };
  
  export default inputTextElement8;
  