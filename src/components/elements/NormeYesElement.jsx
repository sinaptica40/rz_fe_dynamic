const NormeYesElement =({areas,handleDeleteNorme})=>{
   
    return(
        <button onClick={handleDeleteNorme}>
            {areas?.element_data?.interaction_name}
        </button>
    )
}

export default NormeYesElement;