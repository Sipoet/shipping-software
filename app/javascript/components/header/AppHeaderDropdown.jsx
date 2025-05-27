import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

import { SignOut, User, UserCircle } from '@phosphor-icons/react'
import { AuthContext } from '~/lib/context'
import { useNavigate } from 'react-router'

const AppHeaderDropdown = () => {
  const [auth,setAuth] = React.useContext(AuthContext)
  const navigate = useNavigate()

  function logout(event){
    event.preventDefault()
    event.stopPropagation()
    auth.logout().then(result =>{
      if(result.isSuccess){
        navigate('/users/sign_in')
      }
    })
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <User size={20} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="/users/profile">
          <UserCircle/> Profile
        </CDropdownItem>
        <CDropdownItem as={'button'} onClick={logout}>
          <SignOut/> Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
