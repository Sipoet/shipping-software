import React, { Suspense } from 'react'
import { AppSidebar, AppHeader, AppFooter, AppContent } from '~/components/index'
import { CSpinner, CProgress } from '@coreui/react'
import { AuthContext,SettingContext } from '~/lib/context'
import { useNavigate } from 'react-router'

function DefaultLayout(){
  const [progressBar,setProgressBar] = React.useState(0)
  const [progressColor,setProgressColor] = React.useState('info')
  const [auth,setAuth] = React.useContext(AuthContext)
  const [setting,setSetting] = React.useState({})
  const navigate = useNavigate()
  if(auth.navigate === null){
    auth.navigate = navigate
    setAuth(auth)
  }
  React.useEffect(()=>{
    if(auth.isNotSignedIn){
      navigate('/users/sign_in')
      return
    }

  })
  return(
    <div>
      <Suspense fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }>
        <SettingContext.Provider value ={{setting,setSetting}}>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100">
            <CProgress height={2} value={progressBar} color={progressColor} />
            <AppHeader />
            <div className="body flex-grow-1">
              <AppContent progressBar={progressBar} setProgressBar={setProgressBar} progressColor={progressColor} setProgressColor={setProgressColor} />
            </div>
            <AppFooter />
          </div>
        </SettingContext.Provider>

      </Suspense>

    </div>
  )
}
export default DefaultLayout