import { CButton } from '@coreui/react'
import React from 'react'

function RecordActions({record,...props}){
  props.actions ||= []

  React.useEffect(()=>{

  },[record])
  return(
    <div className='action-buttons-container'>
      {props.actions.map((action)=>(
        <CButton {...action.props}>{action.label}</CButton>
      ))}
    </div>
  )
}

export default RecordActions