import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CCardTitle,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CRow } from '@coreui/react'
import React  from 'react'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import  {CustomAsyncSelect}  from '~/components/CustomAsyncSelect'
import { AuthContext } from '~/lib/context'
const ShipScheduleForm = () => {
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
        navigate(`/ship_schedules/${record.id}/edit`, {replace: true})
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
    let targetName = event.currentTarget.name
    record[targetName] = event.currentTarget.value
    setRecord(record)
  }

  function changeSelectRecord(selectValue,metadata){
    let targetName = metadata.name
    record[targetName] = selectValue.value
    setRecord(record)
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
        navigate('ship_schedules')
      }
    })
  }

  function toggleNavigate(){
    if(viewState){
      navigate(`/ship_schedules/${record.id}/edit`)
    }else{
      navigate(`/ship_schedules/${record.id}`)
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
        <CCardHeader>Form Jadwal Kapal

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

              <CCol md={4} className='mb-3' hidden={record.isNewRecord}>
                <CFormInput readOnly={true}  type="text" id="shipSchedule-status" label='Status' invalid={error.status != null}  feedback={error.status} name='status' onChange={changeRecord} defaultValue={record.status} placeholder="Status"/>
              </CCol>

              <CCol md={4} className='mb-3'>
                <CustomAsyncSelect readOnly={viewState} cacheOptions path='/ships.json' name='ship_id' label="Kapal"feedback={error.ship} onChange={changeSelectRecord} defaultValue={{label: record.ship_name,value: record.ship_id}} placeholder="pilih kapal..." />
              </CCol>
              <CCol md={4} className='mb-3'>
                <CFormInput readOnly={viewState}  type="text" id="shipSchedule-voyage" label='Voyage' invalid={error.voyage != null}  feedback={error.voyage} name='voyage' onChange={changeRecord} defaultValue={record.voyage} placeholder="Voyage..."/>
              </CCol>
              <CCol md={4} className='mb-3'>
                <CustomAsyncSelect readOnly={viewState} cacheOptions path='/ports.json' name='loading_port_id' label="Pelabuhan Muatan"feedback={error.loading_port} onChange={changeSelectRecord} defaultValue={{label: record.loading_port_name,value: record.loading_port_id}} placeholder="pilih Pelabuhan..." />
              </CCol>
              <CCol md={4} className='mb-3'>
                <CustomAsyncSelect readOnly={viewState} cacheOptions path='/ports.json' name='destination_port_id' label="Pelabuhan Tujuan"feedback={error.destination_port} onChange={changeSelectRecord} defaultValue={{label: record.destination_port_name,value: record.destination_port_id}} placeholder="pilih Pelabuhan..." />
              </CCol>
              <CRow>
                <CCol md={4} className='mb-3'>
                  <CFormInput readOnly={viewState}  type="datetime-local" id="shipSchedule-estimated_arrived_sour_at" label='Tanggal Estimasi Kapal Mendarat Muatan' invalid={error.estimated_arrived_sour_at != null}  feedback={error.estimated_arrived_sour_at} name='estimated_arrived_sour_at' onChange={changeRecord} defaultValue={record.estimated_arrived_sour_at} />
                </CCol>
                <CCol md={4} className='mb-3'>
                  <CFormInput readOnly={viewState}  type="datetime-local" id="shipSchedule-arrived_sour_at" label='Tanggal Aktual Kapal Mendarat Muatan' invalid={error.arrived_sour_at != null}  feedback={error.arrived_sour_at} name='arrived_sour_at' onChange={changeRecord} defaultValue={record.arrived_sour_at} />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={4} className='mb-3'>
                  <CFormInput readOnly={viewState}  type="datetime-local" id="shipSchedule-estimated_departure_sour_at" label='Tanggal Estimasi Berangkat' invalid={error.estimated_departure_sour_at != null}  feedback={error.estimated_departure_sour_at} name='estimated_departure_sour_at' onChange={changeRecord} defaultValue={record.estimated_departure_sour_at} />
                </CCol>
                <CCol md={4} className='mb-3'>
                  <CFormInput readOnly={viewState}  type="datetime-local" id="shipSchedule-departure_sour_at" label='Tanggal Aktual Berangkat' invalid={error.departure_sour_at != null}  feedback={error.departure_sour_at} name='departure_sour_at' onChange={changeRecord} defaultValue={record.departure_sour_at} />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={4} className='mb-3'>
                  <CFormInput readOnly={viewState}  type="datetime-local" id="shipSchedule-estimated_arrived_dest_at" label='Tanggal Estimasi Kapal Mendarat Tujuan' invalid={error.estimated_arrived_dest_at != null}  feedback={error.estimated_arrived_dest_at} name='estimated_arrived_dest_at' onChange={changeRecord} defaultValue={record.estimated_arrived_dest_at} />
                </CCol>
                <CCol md={4} className='mb-3'>
                  <CFormInput readOnly={viewState}  type="datetime-local" id="shipSchedule-arrived_dest_at" label='Tanggal Aktual Kapal Mendarat Tujuan' invalid={error.arrived_dest_at != null}  feedback={error.arrived_dest_at} name='arrived_dest_at' onChange={changeRecord} defaultValue={record.arrived_dest_at} />
                </CCol>
              </CRow>
              <CCol md={4} className='mb-3'>
                  <CFormInput readOnly={viewState}  type="datetime-local" id="shipSchedule-dorry_container_opened_at" label='Tanggal Kontainer dibongkar di Tujuan' invalid={error.dorry_container_opened_at != null}  feedback={error.dorry_container_opened_at} name='dorry_container_opened_at' onChange={changeRecord} defaultValue={record.dorry_container_opened_at} />
                </CCol>

              <CCol md={4} className='mb-3'>
                <CFormInput readOnly={viewState}  type="text" id="shipSchedule-booking_code" label='Kode Shipment Of Instruction' invalid={error.booking_code != null}  feedback={error.booking_code} name='booking_code' onChange={changeRecord} defaultValue={record.booking_code} />
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

export default ShipScheduleForm
