import React, { Suspense } from 'react'
import {DateTime}  from 'luxon'
import { useNavigate } from 'react-router'
import{createModel} from '~/lib/model'
import {AuthContext, CompanyContext} from '~/lib/context'
import {isEmpty} from 'lodash'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CRow,
  CFormCheck,
  CFooter,
  CAlert,
  CHeader,
  CImage,
  CHeaderBrand,
  CHeaderText,
} from '@coreui/react'
import { User,LockKey } from '@phosphor-icons/react'
function LoginForm(){
  const [error,setError] = React.useState({})
  const [message,setMessage] = React.useState('')
  const [auth,setAuth] = React.useContext(AuthContext)
  const [company,setCompany] = React.useContext(CompanyContext)
  const todayYear = DateTime.now().year
  const [user,setUser] = React.useState(createModel('User',{username: '',password:''}))
  const navigate = useNavigate();
  if(auth.navigate === null){
    auth.navigate = navigate
    setAuth(auth)
  }
  let onProgress = false;



  function login(event){
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false || onProgress) {
      return;
    }
    onProgress = true

    auth.login(user)
        .then(result=>{
          if(result.isSuccess) {
            setError({})
            setMessage('')
            navigate(result.location)
          }else{
            if(result.code=='csrf'){
              location.reload()
            }
            setMessage(result.message)
          }
        }).finally(()=> onProgress = false)
  }
  function changeRecord(event){
    let targetName = event.currentTarget.name
    user[targetName] = event.currentTarget.value
    setUser(user)
  }
  return(
    <Suspense fallback={
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    }>
      <CHeader>
        <CHeaderBrand>

          <CImage src={company.company_icon_path} width={60} />
        </CHeaderBrand>
        <CHeaderText>{company.name}</CHeaderText>
      </CHeader>
      <div className="bg-body-tertiary min-vh-90 d-flex flex-row align-items-center">
          <CContainer>
             <CAlert color='danger' dismissible visible={!isEmpty(message)} onClose={() => setMessage('')}>
              {message}
            </CAlert>
            <CRow className="justify-content-center">
              <CCol md={8}>
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardBody>
                      <CForm method='post' onSubmit={login}>
                        <h1>Login</h1>
                        <p className="text-body-secondary">Sign In to your account</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <User />
                          </CInputGroupText>
                          <CFormInput
                            name="username"
                            required
                            defaultValue={user.username}
                            onChange={changeRecord}
                            placeholder="Username"
                            invalid={error.username != null}
                            feedback={error.username}
                            autoComplete='off' />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <LockKey />
                          </CInputGroupText>
                          <CFormInput
                            name='password'
                            type="password"
                            required
                            invalid={error.password != null}
                            feedback={error.password}
                            onChange={changeRecord}
                            placeholder="Password"
                            autoComplete='off'
                          />
                        </CInputGroup>
                        <CCol className='mb-4' md={6}>
                          <CFormCheck defaultChecked={user.remember_me} label="Remember Me" name='remember_me' onChange={changeRecord}/>
                        </CCol>
                        <CRow>
                          <CCol xs={6}>
                            <CButton type='submit' color="primary" className="px-4">
                              Login
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>

      </div>
      <CFooter className="px-4">
        <div> &#169; {todayYear} {company.name}</div>
      </CFooter>
    </Suspense>
  )
}

export default LoginForm