import React, { Suspense } from 'react'
import {DateTime}  from 'luxon'
import { useNavigate } from 'react-router'
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
} from '@coreui/react'
import { User,LockKey } from '@phosphor-icons/react'
function LoginForm(){
  const [error,setError] = React.useState({})
  const [message,setMessage] = React.useState('')
  const todayYear = DateTime.now().year
  const [user,setUser] = React.useState({username: '',password:''})
  const navigate = useNavigate();
  let onProgress = false;



  function login(event){
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false || onProgress) {
      return;
    }
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content
    let headers = {'Content-Type':'application/json','X-CSRF-Token': csrfToken}
    onProgress = true;
    fetch('/users/sign_in.json',{
      method:'POST',
      body: JSON.stringify({user: user}),
      headers: headers
    }).then((response)=>{
      if(response.status == 200) {
        return response.json().then((result)=> {
          user.password = undefined
          user.jwt = result.data.jwt
          user.requestCsrfToken = result.requestToken
          setError({})
          setMessage('')
          navigate('/')
        })
      }else if(response.status == 422){
        return response.json().then((result)=> {
          // setError(result.error)
          setMessage(result.error)
        })
      }
      else if(response.status == 401){
        return response.json().then((result)=> {
          // setError(result.error)
          setMessage(result.error)
        })
      }
      response.text().then((error)=> {
        setMessage('Terjadi Kesalahan Server. Segera Hubungi Teknikal Support')
        console.error(error)
      })
    }).finally(()=> onProgress = false)
  }
  function changeRecord(event){
    let targetName = event.currentTarget.name
    user[targetName] = event.currentTarget.value
    setUser(user)
  }
  return(
    <>
      <div className="bg-body-tertiary min-vh-90 d-flex flex-row align-items-center">
        <Suspense fallback={
                        <div className="pt-3 text-center">
                          <CSpinner color="primary" variant="grow" />
                        </div>
                      }>
          <CContainer>
             <CAlert color='danger' dismissible visible={message.trim() !==''} onClose={() => setMessage('')}>
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
                        <CCol className='mb-4' md={4}>
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
        </Suspense>
      </div>
      <CFooter className="px-4">
        <div> &#169; {todayYear} Cipta Karya Agung Sejahtera.</div>
      </CFooter>
    </>
  )
}

export default LoginForm