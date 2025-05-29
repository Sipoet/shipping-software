import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CFormSelect,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
import React  from 'react'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import { AuthContext } from '~/lib/context'
import { createModel } from '~/lib/model'

const PortForm = () => {
  const params = useLoaderData()
  const [record,setRecord] = React.useState(params.record)
  const [visible, setVisible] = React.useState(false)
  const [visibleConfirmationDelete, setVisibleConfirmationDelete] = React.useState(false)
  const [viewState, setViewState] = React.useState(params.isViewState)
  const [status, setStatus] = React.useState('info')
  const [message, setMessage] = React.useState('')
  const [toast, setToast] = React.useState()
  const [error, setError] = React.useState({})
  const toaster = React.useRef(null)
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
        navigate(`/ports/${record.id}`, {replace: true})
        setError({})
      }
      if(result.isSuccess){
        setRecord(result.record)
        showSuccessNotif(result.message)
        setError({})
      }else{
        setError(result.error)
        showErrorNotif(result.message)
      }
    })
  }

  function showSuccessNotif(message){
    setToast(
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
    if(record.isNewRecord){
      setRecord({...record,country: record.country || 'indonesia'})
    }
  }, [params.isViewState])

  function changeRecord(event){
    const targetName = event.currentTarget.name
    record[targetName] = event.currentTarget.value
    const newRecord = createModel(record._modelName,record.attributes)
    setRecord(newRecord)
  }

  function confirmDelete(){
    formHelper.deleteRecord(record).then((result)=>{
      if(result === true){
        setVisibleConfirmationDelete(false)
        setToast(
          (<CToast color='success' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Sukses</div>
            </CToastHeader>
            <CToastBody>Sukses hapus</CToastBody>
          </CToast>))
        navigate('ports')
      }
    })
  }

  const countryOptions = [
    {label: ''},
    {label: 'Indonesia', value: 'indonesia'},
    {label: 'Singapura', value: 'singapura'},
    {label: 'Malaysia', value: 'malaysia'},
    {label: 'Australia', value: 'australia'}
  ]

  function toggleNavigate(){
    if(viewState){
      navigate(`/ports/${record.id}/edit` )
    }else{
      navigate(`/ports/${record.id}`)
    }
  }
  return (
    <>
      <CModal
        visible={visibleConfirmationDelete}
        onClose={() => setVisibleConfirmationDelete(false)}
        aria-labelledby="deleteConfirmation"
      >
        <CModalHeader>
          <CModalTitle id="deleteConfirmation">Konfirmasi Hapus</CModalTitle>
        </CModalHeader>
        <CModalBody>Apakah Yakin Hapus kapal {record.name} ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleConfirmationDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>Hapus</CButton>
        </CModalFooter>
      </CModal>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CCard>
        <CCardHeader>Form Pelabuhan

        <div className='float-end' hidden={record.isNewRecord}>
          <CButton color={viewState ? 'secondary' : 'info'} type="button" className='me-3' onClick={toggleNavigate}>
              {viewState ?  (<>Edit <Pencil /></>): (<>Lihat <Eye /></>) }
          </CButton>
          <CButton color="danger" type="button" onClick={()=> setVisibleConfirmationDelete(true)}>
              Hapus
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
            <CCol md={3}>
              <CFormInput readOnly={viewState} type="text" id="port-name" label='Nama Pelabuhan' invalid={error.name != null}  feedback={error.name} name='name' onChange={changeRecord} value={record.name} placeholder="nama kapal"/>
            </CCol>
            <CCol md={3}>
              <CFormInput readOnly={viewState} type="text" id="port-city" label='Kota / Kabupaten' invalid={error.city != null}  feedback={error.city} name='city' onChange={changeRecord} value={record.city} placeholder="Kota / Kabupaten"/>
            </CCol>
            <CCol md={3}>
              <CFormSelect disabled={viewState} options={countryOptions} id="port-country" label='Negara' invalid={error.country != null}  feedback={error.country} name='country' onChange={changeRecord} value={record.country} placeholder="Negara"/>
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

export default PortForm
