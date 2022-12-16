import React from 'react'
import { ItemTypes } from './items.js'
import { useDrag } from 'react-dnd'


function DragCategory({ category, index }){
  const [{isDragging},drag] = useDrag({
    item: {
      type: ItemTypes.CATEGORY,
      id: index,
      name:category
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  })
  
  return(
      <div>
          <h4 
            ref={drag} 
            className="dragCategory"
            opacity={isDragging ? '0.5' : '1'}
            >{category}</h4>
      </div>
  )
}

function CategoryBlock({ category, relabel, description, index}){
  return(
    <div className="categoryBlock">
      <DragCategory category={category} index={index} />
      <h4>{relabel}</h4>
      <p>{description}</p>
    </div>
  )
}

export default CategoryBlock;
