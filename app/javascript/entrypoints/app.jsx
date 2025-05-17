import React, { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
// import '@coreui/coreui-free-react-admin-template/src/scss/style.scss'
import routerDef from './routes'
import '~/stylesheets/style.scss'




const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (

    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <RouterProvider router={routerDef} />
    </Suspense>

  )
}

export default App
