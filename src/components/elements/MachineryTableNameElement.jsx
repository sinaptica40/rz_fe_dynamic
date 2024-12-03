import React from 'react'

const MachineryTableNameElement = ({areas}) => {
    const name = areas.element_data.block_name
  return (
    <span>{name}</span>
   )
}

export default MachineryTableNameElement