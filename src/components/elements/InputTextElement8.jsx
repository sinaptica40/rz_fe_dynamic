const inputTextElement8 = ({ areas, formValues, formName, handleNotes, formData }) => {
  const handleInputChange = (e) => {
    handleNotes(e);
  };

  return (
    <>
      <input
        name={`${formName?.name}`}
        type={`${formName?.type}`}
        className="form-control"
        id="floatingInput"
        onChange={formData ? handleInputChange : null}
        value={formValues}
      />
      <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
    </>
  );
};

export default inputTextElement8;
