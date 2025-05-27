import {CAlert, CCol,CForm,CButton,CCard,CCardHeader,CCardBody,CCardFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CFormSelect, CRow } from '@coreui/react'
import React  from 'react'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import ConfirmModal from '~/components/ConfirmModal'
import { AuthContext } from '~/lib/context'
import { createModel } from '~/lib/model'
import {CustomAsyncSelect} from '~/components/CustomAsyncSelect'
const UserForm = () => {
  const params = useLoaderData()
  const [record,setRecord] = React.useState(params.record)
  const [visible, setVisible] = React.useState(false)
  const [viewState, setViewState] = React.useState(params.isViewState)
  const [status, setStatus] = React.useState('info')
  const [message, setMessage] = React.useState('')
  const [toast, addToast] = React.useState()
  const [error, setError] = React.useState({})
  const toaster = React.useRef(null)
  let modalRef = React.useRef(null)
  const [progressBar,setProgressBar,progressColor,setProgressColor] = useOutletContext()
  const progressOptions ={progressBar,setProgressBar,progressColor,setProgressColor,showProgress: true}
  const navigate = useNavigate()
  const [auth,setAuth] = React.useContext(AuthContext)
  const formHelper = new FormHelper(auth)

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false || progressBar > 0) {
      return;
    }

    let isNewRecord = record.isNewRecord
    formHelper.saveRecord(record,progressOptions).then((result)=>{
      if(result.isSuccess && isNewRecord){
        navigate(`/users/${record.id}/edit`, {replace: true})
      }
      if(result.isSuccess){
        setError({})
        setRecord(result.record)
        showSuccessNotif(result.message)
      }else{
        setError(result.error)
        showErrorNotif(result.message)
      }
    })
  }

  function showSuccessNotif(message){
    addToast(
    (<CToast color='success' key={'toast-form'}>
      <CToastHeader closeButton>
        <div className="fw-bold me-auto">Sukses</div>
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>)
    )
  }

  function showErrorNotif(message){
    setStatus('danger')
    setMessage(message)
    setVisible(true)
  }

  React.useEffect(() =>  {
    setViewState(params.isViewState)
  }, [params.isViewState])

  function changeRecord(event){
    const targetName = event.currentTarget.name
    record[targetName] = event.currentTarget.value
    const newRecord = createModel(record._modelName,record.attributes)
    setRecord(newRecord)
  }

  function changeSelectRecord(selectValue,metadata){
    record[metadata.optionLabel] = selectValue.label
    record[metadata.name] = selectValue.value
    const newRecord = createModel(record._modelName,record.attributes)
    setRecord(newRecord)
  }

  function confirmDelete(result){
    if(result !== true){
      return
    }
    formHelper.deleteRecord(record).then((result)=>{
      if(result === true){
        addToast(
          (<CToast color='success' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Sukses</div>
            </CToastHeader>
            <CToastBody>Sukses hapus</CToastBody>
          </CToast>))
        navigate('/users')
      }
    })


  }

  function toggleNavigate(){
    if(viewState){
      navigate(`/users/${record.id}/edit` )
    }else{
      navigate(`/users/${record.id}`)
    }
  }
  function activate(){
    auth.request(`/users/${record.id}/activate.json`,{method: 'POST'}).then((response)=>{
      if(response.status == 200){
        setRecord({...record,is_active: true})
        addToast(
          (<CToast color='success' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Sukses</div>
            </CToastHeader>
            <CToastBody>Sukses Aktivasi</CToastBody>
          </CToast>))
      }else{
        addToast(
          (<CToast color='danger' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Gagal</div>
            </CToastHeader>
            <CToastBody>Gagal Aktivasi</CToastBody>
          </CToast>))
      }
    })
  }

  function deactivate(){
    auth.request(`/users/${record.id}/deactivate.json`,{method: 'POST'}).then((response)=>{
      if(response.status == 200){
        setRecord({...record,is_active: false})
        addToast(
          (<CToast color='success' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Sukses</div>
            </CToastHeader>
            <CToastBody>Sukses Deaktivasi</CToastBody>
          </CToast>))
      }else{
        addToast(
          (<CToast color='danger' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Gagal</div>
            </CToastHeader>
            <CToastBody>Gagal Deaktivasi</CToastBody>
          </CToast>))
      }
    })
  }

  return (
    <>
      <ConfirmModal title="Konfirmasi Hapus" description={`Apakah anda yakin hapus User ${record.username}`} submitLabel="Submit" ref={modalRef} resolving={confirmDelete} />
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CCard>
        <CCardHeader>Form User

        <div className='float-end'>
          <CButton color={viewState ? 'secondary' : 'info'} type="button" className='me-3' onClick={toggleNavigate}>
              {viewState ?  (<>Edit <Pencil /></>): (<>Batal</>) }
          </CButton>
          <CButton color="success" hidden={record.is_active || !viewState} type="button" onClick={activate}>
              Aktifkan
          </CButton>
          <CButton color="warning" hidden={!record.is_active || !viewState} type="button" onClick={deactivate}>
              Non Aktifkan
          </CButton>
        </div>
        </CCardHeader>
        <CForm
            className="row g-3 needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
          <CCardBody>
            <CAlert color={status} dismissible visible={visible} onClose={() => setVisible(false)}>
              {message}
            </CAlert>
            <CCol className='mb-4' md={4}>
              <CFormInput readOnly={viewState} type="text" id="user-username" label='Username' invalid={error.username != null}  feedback={error.username} name='username' onChange={changeRecord} value={record.username}/>
            </CCol>
            <CCol className='mb-4' md={4}>
              <CFormInput readOnly={viewState} type="email" id="user-email" label='Email' invalid={error.email != null}  feedback={error.email} name='email' onChange={changeRecord} value={record.email}/>
            </CCol>
            <CCol className='mb-4' md={4}>
              <CFormInput readOnly={viewState} type="password" id="user-password" label='Password' invalid={error.password != null}  feedback={error.password} name='password' onChange={changeRecord} value={record.password}/>
            </CCol>
            <CCol className='mb-4' md={4}>
              <CFormInput readOnly={viewState} type="password" id="user-passwordConfirmation" label='Konfirmasi Password' invalid={error.password_confirmation != null}  feedback={error.password_confirmation} name='password_confirmation' onChange={changeRecord} value={record.password_confirmation}/>
            </CCol>
            <CCol className='mb-4' md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/roles.json' name='role_id' label="Jabatan" feedback={error.role} onChange={changeSelectRecord} defaultValue={{label: record.role_name,value: record.role_id}}  />
            </CCol>
          </CCardBody>
          <CCardFooter hidden={viewState}>
            <CButton color="primary" type="submit">
              Simpan
            </CButton>
          </CCardFooter>
        </CForm>
      </CCard>



    </>
  )
}

export default UserForm
