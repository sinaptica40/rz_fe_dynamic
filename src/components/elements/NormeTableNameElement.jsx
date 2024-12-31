import React from 'react'

const NormeTableNameElement = ({ areas }) => {
  const name = areas.element_data.block_name
  return (
    <span>{name}</span>
  )
}

export default NormeTableNameElement;