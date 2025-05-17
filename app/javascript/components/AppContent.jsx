import React from 'react'
import { Outlet, useNavigation} from 'react-router'
import { CContainer, CSpinner,CProgress } from '@coreui/react'


const AppContent = ({progressBar,setProgressBar,progressColor,setProgressColor}) => {
  const navigation = useNavigation()
  return (

    <CContainer className="px-4 text-center" lg>
      <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} hidden={navigation.state !== 'loading'}/>
      <div hidden={navigation.state === 'loading'}>
        <Outlet context={[progressBar,setProgressBar,progressColor,setProgressColor]} />
      </div>
    </CContainer>
  )
}

export default React.memo(AppContent)
