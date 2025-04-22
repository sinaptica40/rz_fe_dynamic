const IspezioneYesElement =({areas,deleteInspection})=>{
    console.log(areas?.element_data?.interaction_name,'check this element data interaction')
   
    return(
        <button onClick={deleteInspection}>
            {areas?.element_data?.interaction_name}
        </button>
    )
}

export default IspezioneYesElement;