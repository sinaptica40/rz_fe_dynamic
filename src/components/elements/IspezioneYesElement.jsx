const IspezioneYesElement =({areas,deleteInspection})=>{
   
    return(
        <button onClick={deleteInspection}>
            {areas?.element_data?.interaction_name}
        </button>
    )
}

export default IspezioneYesElement;