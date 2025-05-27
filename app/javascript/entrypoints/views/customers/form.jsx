import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CFormTextarea } from '@coreui/react'
import React  from 'react'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import { PhoneInput } from '~/components/NumberInput'
import { AuthContext } from '~/lib/context'
import { createModel } from '~/lib/model'

const CustomerForm = () => {
  const params = useLoaderData()
  const [record,setRecord] = React.useState(params.record)
  const [visible, setVisible] = React.useState(false)
  const [visibleConfirmationDelete, setVisibleConfirmationDelete] = React.useState(false)
  const [viewState, setViewState] = React.useState(params.isViewState)
  const [status, setStatus] = React.useState('info')
  const [message, setMessage] = React.useState('')
  const [toast, addToast] = React.useState()
  const [error, setError] = React.useState({})
  const toaster = React.useRef(null)
  const [progressBar,setProgressBar,progressColor,setProgressColor] = useOutletContext()
  const progressOptions ={progressBar,setProgressBar,progressColor,setProgressColor,showProgress: true}
  const navigate = useNavigate()
  const phoneRef = React.useRef(null)
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
        navigate(`/customers/${record.id}/edit`, {replace: true})
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

  function changePhoneRecord(event){
    let targetName = event.currentTarget.name
    record[targetName] = phoneRef.current.maskRef.unmaskedValue
    setRecord(record)
    console.log(record[targetName])
  }

  function confirmDelete(){
    formHelper.deleteRecord(record).then((result)=>{
      if(result === true){
        setVisibleConfirmationDelete(false)
        addToast(
          (<CToast color='success' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Sukses</div>
            </CToastHeader>
            <CToastBody>Sukses hapus</CToastBody>
          </CToast>))
        navigate('customers')
      }
    })
  }

  function toggleNavigate(){
    if(viewState){
      navigate(`/customers/${record.id}/edit` )
      setViewState(false)
    }else{
      navigate(`/customers/${record.id}`)
      setViewState(true)
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
        <CModalBody>Apakah Yakin Hapus Pelanggan {record.name} ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleConfirmationDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>Hapus</CButton>
        </CModalFooter>
      </CModal>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CCard>
        <CCardHeader>Form Pelanggan

        <div className='float-end' hidden={record.isNewRecord}>
          <CButton color={viewState ? 'secondary' : 'info'} type="button" className='me-3' onClick={toggleNavigate}>
              {viewState ?  (<>Edit <Pencil /></>): (<>Lihat <Eye /></>) }
          </CButton>
          <CButton color="danger" type="button" onClick={()=> setVisibleConfirmationDelete(true)}>
              Delete
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
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="customer-name" label='Nama Customer' invalid={error.name != null}  feedback={error.name} name='name' onChange={changeRecord} value={record.name} placeholder="nama kapal"/>
            </CCol>
            <CCol md={4}>
              <PhoneInput readOnly={viewState} ref={phoneRef} id="customer-contactNumber" label='Kontak' invalid={error.contact_number != null}  feedback={error.contact_number} name='contact_number' onChange={changePhoneRecord} defaultValue={record.contact_number}/>
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="customer-taxAccount" label='NPWP' invalid={error.tax_account != null}  feedback={error.tax_account} name='tax_account' onChange={changeRecord} value={record.tax_account} />
            </CCol>
            <CCol md={4}>
              <CFormTextarea readOnly={viewState} type="text" id="customer-address" label='Alamat' invalid={error.address != null}  feedback={error.address} name='address' onChange={changeRecord} value={record.address} />
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="customer-bank" label='Bank' invalid={error.bank != null}  feedback={error.bank} name='bank' onChange={changeRecord} value={record.bank} />
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="customer-bankRegisterName" label='Nama pemilik rekening' invalid={error.bank_register_name != null}  feedback={error.bank_register_name} name='bank_register_name' onChange={changeRecord} value={record.bank_register_name} />
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="customer-bankAccount" label='Nomor Rekening' invalid={error.bank_account != null}  feedback={error.bank_account} name='bank_account' onChange={changeRecord} value={record.bank_account} />
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

export default CustomerForm
