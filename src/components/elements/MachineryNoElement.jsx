const MachineryNoElement = ({ areas, setShowModal }) => {
  return (
    <button onClick={() => setShowModal(false)}>
      {areas?.element_data?.interaction_name}
    </button>
  )
}

export default MachineryNoElement;