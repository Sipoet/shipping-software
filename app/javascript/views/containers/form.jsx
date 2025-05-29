import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CFormSelect,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
import React  from 'react'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import  {CustomAsyncSelect}  from '~/components/CustomAsyncSelect'
import { dateFormat } from '~/lib/text_formatter'
import { AuthContext } from '~/lib/context'
import { createModel } from '~/lib/model'

const ContainerForm = () => {
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
        navigate(`/containers/${record.id}/edit`, {replace: true,state: record})
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
    setRecord(params.record)
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
        navigate('containers')
      }
    })
  }

  function toggleNavigate(){
    if(viewState){
      navigate(`/containers/${record.id}/edit`)
    }else{
      navigate(`/containers/${record.id}`)
    }
  }

  function shipScheduleDetail(data){
    return `${data.ship_name}, ${dateFormat(data.estimated_departure_sour_at)}-${dateFormat(data.estimated_arrived_dest_at)}`
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
        <CModalBody>Apakah Yakin Hapus Kontainer {record.container_number} ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleConfirmationDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>Hapus</CButton>
        </CModalFooter>
      </CModal>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CCard>
        <CCardHeader>Form Kontainer

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
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="container-containerNumber" label='Nomor Kontainer' invalid={error.container_number != null}  feedback={error.container_number} name='container_number' onChange={changeRecord} value={record.container_number}/>
            </CCol>
            <CCol md={4}>
              <CFormInput readOnly={viewState} type="text" id="container-sealNumber" label='Nomor Segel' invalid={error.seal_number != null}  feedback={error.seal_number} name='seal_number' onChange={changeRecord} value={record.seal_number} />
            </CCol>
            <CCol md={4}>
              <CFormSelect readOnly={viewState}
                id="container-orderType"
                label='Jenis Pengiriman'
                invalid={error.order_type != null}
                feedback={error.order_type}
                name='order_type'
                onChange={changeRecord}
                defaultValue={record.order_type} >
                  <option>Pilih..</option>
                  <option value="less_container_load">LCL (Less Than Container Load)</option>
                  <option value="full_container_load">FCL (Full Container Load)</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/container_types.json' name='container_type_id' label="Tipe Kontainer" feedback={error.container_type} onChange={changeSelectRecord} optionLabel='container_type_name' value={{label: record.container_type_name,value: record.container_type_id}} placeholder="pilih Tipe Kontainer..." />
            </CCol>
            <CCol md={4}>
              <CustomAsyncSelect isClearable readOnly={viewState} cacheOptions path='/ship_schedules.json' getOptionLabel={shipScheduleDetail} name='ship_schedule_id' label="Jadwal Kapal" feedback={error.ship_schedule} optionLabel='ship_schedule_detail' onChange={changeSelectRecord} value={{label: record.ship_schedule_detail,value: record.ship_schedule_id}} placeholder="pilih Jadwal kapal..." />
            </CCol>
            <CCol md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/agents.json' name='agent_id' label="Agen Lorry" feedback={error.agent} onChange={changeSelectRecord} optionLabel='agent_name' value={{label: record.agent_name,value: record.agent_id}} placeholder="pilih Agen Lorry..." />
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

export default ContainerForm
