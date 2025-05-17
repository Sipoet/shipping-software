import React, { Suspense } from 'react'
import { AppSidebar, AppHeader, AppFooter, AppContent } from '~/components/index'
import { CSpinner, CProgress } from '@coreui/react'


function DefaultLayout(){
  const [progressBar,setProgressBar] = React.useState(0)
  const [progressColor,setProgressColor] = React.useState('info')
  return(
    <div>
      <Suspense fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <CProgress height={2} value={progressBar} color={progressColor} />
          <AppHeader />
          <div className="body flex-grow-1">
            <AppContent progressBar={progressBar} setProgressBar={setProgressBar} progressColor={progressColor} setProgressColor={setProgressColor} />
          </div>
          <AppFooter />
        </div>
      </Suspense>

    </div>
  )
}
export default DefaultLayout