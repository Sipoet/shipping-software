import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CFormTextarea } from '@coreui/react'
import React  from 'react'
import { FormHelper, changeCloneRecord } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import { PhoneInput } from '~/components/NumberInput'
import {CustomAsyncSelect} from '~/components/CustomAsyncSelect'
import { AuthContext } from '~/lib/context'

const AgentForm = () => {
  const params = useLoaderData()
  const [record,setRecord] = React.useState(params.record)
  const [visible, setVisible] = React.useState(false)
  const [visibleConfirmationDelete, setVisibleConfirmationDelete] = React.useState(false)
  const [viewState, setViewState] = React.useState(params.isViewState)
  const [status, setStatus] = React.useState('info')
  const [message, setMessage] = React.useState('')
  const [toast, addToast] = React.useState()
  const [error, addError] = React.useState({})
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
        navigate(`/agents/${record.id}`, {replace: true})
      }
      if(result.isSuccess){
        setRecord(result.record)
        showSuccessNotif(result.message)
      }else{
        addError(result.error)
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

  function changeSelectRecord(selectValue,metadata){
    setRecord((record)=> changeCloneRecord(record,[metadata.optionLabel,selectValue.label,metadata.name,selectValue.value]) )
  }

  React.useEffect(() =>  {
    setViewState(params.isViewState)
  }, [params.isViewState])

  function changeRecord(event){
    const targetName = event.currentTarget.name
    const value = event.currentTarget.value
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function changePhoneRecord(maskedValue,imask,event){
    const targetName = event.currentTarget.name
    setRecord((record)=> changeCloneRecord(record,[targetName,imask.unmaskedValue]) )
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
        navigate('agents')
      }
    })
  }

  function toggleNavigate(){
    if(viewState){
      navigate(`/agents/${record.id}/edit` )
    }else{
      navigate(`/agents/${record.id}`)
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
        <CModalBody>Apakah Yakin Hapus Agent {record.name} ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleConfirmationDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>Hapus</CButton>
        </CModalFooter>
      </CModal>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CCard>
        <CCardHeader>Form Agent

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
              <CFormInput readOnly={viewState} type="text" id="agent-name" label='Nama Agent' invalid={error.name != null}  feedback={error.name} name='name' onChange={changeRecord} value={record.name} placeholder="Nama Agent"/>
            </CCol>
            <CCol md={4}>
              <PhoneInput readOnly={viewState} id="agent-contactNumber" label='Kontak' invalid={error.contact_number != null}  feedback={error.contact_number} name='contact_number' onChange={changePhoneRecord} defaultValue={record.contact_number}/>
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="agent-taxAccount" label='NPWP' invalid={error.tax_account != null}  feedback={error.tax_account} name='tax_account' onChange={changeRecord} value={record.tax_account} />
            </CCol>
            <CCol md={4}>
              <CFormTextarea readOnly={viewState} type="text" id="agent-address" label='Alamat' invalid={error.address != null}  feedback={error.address} name='address' onChange={changeRecord} value={record.address} />
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="agent-bank" label='Bank' invalid={error.bank != null}  feedback={error.bank} name='bank' onChange={changeRecord} value={record.bank} />
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="agent-bankRegisterName" label='Nama pemilik rekening' invalid={error.bank_register_name != null}  feedback={error.bank_register_name} name='bank_register_name' onChange={changeRecord} value={record.bank_register_name} />
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="agent-bankAccount" label='Nomor Rekening' invalid={error.bank_account != null}  feedback={error.bank_account} name='bank_account' onChange={changeRecord} value={record.bank_account} />
            </CCol>
            <CCol md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='ports.json' name='default_port_id' label="Pelabuhan Default"feedback={error.default_port} onChange={changeSelectRecord} defaultValue={{label: record.default_port_name,value: record.default_port_id}} placeholder="pilih Pelabuhan..." />
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

export default AgentForm
