import React from 'react'
import { Outlet} from 'react-router'
import { CContainer, CSpinner } from '@coreui/react'


const AppContent = ({progressBar,setProgressBar,progressColor,setProgressColor}) => {
  return (

    <CContainer className="px-4" fluid>
      <div className="text-left">
        <Outlet context={[progressBar,setProgressBar,progressColor,setProgressColor]} />
      </div>
    </CContainer>
  )
}

export default React.memo(AppContent)
