import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  let date = new Date()
  return (
    <CFooter className="px-4">
      <div> © {date.getFullYear()} Cipta Karya Agung Sejahtera.</div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
