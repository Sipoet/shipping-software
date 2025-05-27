import { CButton } from '@coreui/react'
import React from 'react'

function RecordActions({record,actions,...props}){
  actions ||= []

  React.useEffect(()=>{

  },[record])

  return(
    <div {...props}>
      <div  className='action-buttons-container'>
        {actions.map((action)=>(
          <CButton key={actions.indexOf(action)} {...action.props}>{action.label}</CButton>
        ))}
      </div>
    </div>

  )
}

export default RecordActions