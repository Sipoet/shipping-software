import React from 'react'
import { Outlet, useNavigation} from 'react-router'
import { CContainer, CSpinner } from '@coreui/react'


const AppContent = ({progressBar,setProgressBar,progressColor,setProgressColor}) => {
  const navigation = useNavigation()
  return (

    <CContainer className="px-4" fluid>
      <div className='text-center' hidden={navigation.state !== 'loading'}>
        <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
      <div hidden={navigation.state === 'loading'} className="text-left">
        <Outlet context={[progressBar,setProgressBar,progressColor,setProgressColor]} />
      </div>
    </CContainer>
  )
}

export default React.memo(AppContent)
