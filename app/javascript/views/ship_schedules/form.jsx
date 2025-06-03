import {CAlert,CFormLabel,CCol,CForm,CButton,CCard,CCardHeader,CCardBody,CCardFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CRow } from '@coreui/react'
import React  from 'react'
import {createRoot} from 'react-dom/client'
import { FormHelper,changeCloneRecord } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { ArrowClockwise, ArrowCounterClockwise,X, Eye, Pencil, Plus, Trash } from '@phosphor-icons/react'
import  {CustomAsyncSelect}  from '~/components/CustomAsyncSelect'
import { AuthContext } from '~/lib/context'
import RecordActions from '~/components/RecordActions'
import ConfirmModal from '~/components/ConfirmModal'
import ShipScheduleStatusBadge from './status_badge'
import SiReleasedModalForm from './si_released_modal_form'
import ShipDepartModalForm from './ship_depart_modal_form'
import ShipArrivedModalForm from './ship_arrived_modal_form'
import ShipCompletedModalForm from './ship_completed_modal_form'
import {KDatePicker} from '~/components/KDatePicker'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'

const ShipScheduleForm = () => {
  const params = useLoaderData()
  const [record,setRecord] = React.useState(params.record)
  const [visible, setVisible] = React.useState(false)
  const [viewState, setViewState] = React.useState(params.isViewState)
  const [status, setStatus] = React.useState('info')
  const [message, setMessage] = React.useState('')
  const [toast, addToast] = React.useState()
  const [error, setError] = React.useState({})
  const [visibleSiReleasedForm, setVisibleSiReleasedForm] = React.useState(false)
  const [visibleShipDepartForm, setVisibleShipDepartForm] = React.useState(false)
  const [visibleShipArrivedForm, setVisibleShipArrivedForm] = React.useState(false)
  const [visibleCompletedForm, setVisibleCompletedForm] = React.useState(false)
  const toaster = React.useRef(null)
  const [progressBar,setProgressBar,progressColor,setProgressColor] = useOutletContext()
  const progressOptions ={progressBar,setProgressBar,progressColor,setProgressColor,showProgress: true}
  const navigate = useNavigate()
  const [auth,setAuth] = React.useContext(AuthContext)
  const formHelper = new FormHelper(auth)
  const confirmModalRef = React.useRef(null)
  const containerTableRef = React.useRef(0)
  const [container, setContainer] = React.useState({})

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
    setVisible(false)
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
    const value = event.currentTarget.value
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function changeSelectRecord(selectValue,metadata){
    setRecord((record)=> changeCloneRecord(record,[metadata.optionLabel,selectValue.label,metadata.name,selectValue.value]) )
  }

  function changeDateRecord(date,name){
    setRecord((record)=> changeCloneRecord(record,[name,date]) )
  }

  function confirmDelete(){
    confirmModalRef.current.openModal({
      title: "Konfirmasi Hapus",
      description: `Apakah Yakin hapus jadwal kapal ${record.voyage} ?`,
      submitColor:'danger',
      submitLabel:'Hapus',
      resolving:(result)=>{
        if(!result){
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
            navigate('ship_schedules')
          }
        })
      }})


  }

  function toggleNavigate(){
    if(record.status !=='draft'){
      setViewState(true)
    }
    if(viewState){
      navigate(`/ship_schedules/${record.id}/edit`)
    }else{
      navigate(`/ship_schedules/${record.id}`)
    }
  }
  function setConfirm(){
    confirmModalRef.current.openModal({
      title: "Konfirmasi Aksi",
      description: `Apakah yakin Konfirm jadwal kapal ${record.voyage} ?`,
      submitColor:'info',
      resolving:(result)=>{
        if(result){
          auth.request(`/ship_schedules/${record.id}/set_port_processed.json`,{method:'POST'}).then((response)=>{
            if(response.status === 200){
              setRecord((record)=> changeCloneRecord(record,['status','port_processed']) )

              addToast(
                (<CToast color='success' key={'toast-form'}>
                  <CToastHeader closeButton>
                    <div className="fw-bold me-auto">Sukses</div>
                  </CToastHeader>
                  <CToastBody>Sukses Konfirm</CToastBody>
                </CToast>))
            }else{
              addToast(
                (<CToast color='danger' key={'toast-form'}>
                  <CToastHeader closeButton>
                    <div className="fw-bold me-auto">Gagal</div>
                  </CToastHeader>
                  <CToastBody>Gagal Konfirm</CToastBody>
                </CToast>))
              refreshRecord()
            }
          })
        }
      }
    })

  }

  function openSiForm(){
    setVisibleSiReleasedForm(true)
  }

  function openShipDepartForm(){
    setVisibleShipDepartForm(true)

  }
  function openShipArrivedForm(){
    setVisibleShipArrivedForm(true)
  }

  function setComplete(){
    setVisibleCompletedForm(true)
  }

  function setCancel(){
    confirmModalRef.current.openModal({
      title: "Konfirmasi Aksi",
      description: `Apakah Yakin Batalkan jadwal kapal ${record.voyage} ?`,
      submitColor:'danger',
      resolving:(result)=>{
        if(result){
          auth.request(`/ship_schedules/${record.id}/set_cancelled.json`,{method:'POST'}).then((response)=>{
            if(response.status === 200){
              setRecord((record)=> changeCloneRecord(record,['status','cancelled']) )

              addToast(
                (<CToast color='success' key={'toast-form'}>
                  <CToastHeader closeButton>
                    <div className="fw-bold me-auto">Sukses</div>
                  </CToastHeader>
                  <CToastBody>Sukses Batalkan</CToastBody>
                </CToast>))
            }else{
              addToast(
                (<CToast color='danger' key={'toast-form'}>
                  <CToastHeader closeButton>
                    <div className="fw-bold me-auto">Gagal</div>
                  </CToastHeader>
                  <CToastBody>Gagal Batalkan</CToastBody>
                </CToast>))
              refreshRecord()
            }
          })
        }
      }
    })
  }

  function setDraft(){
    confirmModalRef.current.openModal({
      title: "Konfirmasi Aksi",
      description: `Apakah Yakin Draftkan jadwal kapal ${record.voyage} ?`,
      submitColor:'light',
      resolving:(result)=>{
        if(result){
          auth.request(`/ship_schedules/${record.id}/set_draft.json`,{method:'POST'}).then((response)=>{
            if(response.status === 200){
              setRecord((record)=> changeCloneRecord(record,['status','draft']) )

              addToast(
                (<CToast color='success' key={'toast-form'}>
                  <CToastHeader closeButton>
                    <div className="fw-bold me-auto">Sukses</div>
                  </CToastHeader>
                  <CToastBody>Sukses Draftkan</CToastBody>
                </CToast>))
            }else{
              addToast(
                (<CToast color='danger' key={'toast-form'}>
                  <CToastHeader closeButton>
                    <div className="fw-bold me-auto">Gagal</div>
                  </CToastHeader>
                  <CToastBody>Gagal Draftkan</CToastBody>
                </CToast>))
              refreshRecord()
            }
          })
        }
      }
    })
  }

  async function refreshRecord(){
    const newRecord = await formHelper.findRecord(record._modelName,record.id)
    setRecord(newRecord)
  }

  const recordActions = [
    {
      label: (<>Refresh <ArrowClockwise /></>),
      props:{
        color: 'secondary',
        onClick: refreshRecord,
        hidden: !auth.isAuthorize('ship_schedule','read') || record.isNewRecord || !viewState,
      }
    },
    {
      label: (<>Edit <Pencil /></>),
      props:{
        color: 'info',
        onClick: toggleNavigate,
        hidden: !auth.isAuthorize('ship_schedule','update') || record.isNewRecord || !viewState || record.status !== 'draft',
      }
    },
    {
      label: (<>Lihat <Eye /></>),
      props:{
        color: 'secondary',
        onClick: toggleNavigate,
        hidden: !auth.isAuthorize('ship_schedule','read') || record.isNewRecord || viewState || record.status !== 'draft',
      }
    },
    {
      label: (<>Hapus <Trash /></>),
      props:{
        color: 'danger',
        onClick: ()=> confirmDelete,
        hidden: !auth.isAuthorize('ship_schedule','delete') || record.isNewRecord || record.status !== 'draft',
      }
    },
    {
      label: (<>Kembali ke Draft <ArrowCounterClockwise /></>),
      props:{
        color: 'light',
        onClick: setDraft,
        hidden: !auth.isAuthorize('ship_schedule','set_draft') || record.isNewRecord || !(['port_processed','cancelled'].includes(record.status)),
      }
    },
    {
      label: 'Konfirm',
      props:{
        color: 'info',
        onClick: setConfirm,
        hidden: !auth.isAuthorize('ship_schedule','set_port_processed') || !viewState || record.isNewRecord || !(['draft','si_released'].includes(record.status)),
      }
    },
    {
      label: 'SI Keluar',
      props:{
        color: 'info',
        onClick: openSiForm,
        hidden: !auth.isAuthorize('ship_schedule','set_si_released') || !viewState || !(['port_processed','ship_depart'].includes(record.status)),
      }
    },
    {
      label: 'Kapal Berangkat',
      props:{
        color: 'info',
        onClick: openShipDepartForm,
        hidden: !auth.isAuthorize('ship_schedule','set_ship_depart') || !viewState || !(['si_released','arrived_to_destination'].includes(record.status)),
      }

    },
    {
      label: 'Kapal Tiba di Tujuan',
      props:{
        color: 'info',
        onClick: openShipArrivedForm,
        hidden: !auth.isAuthorize('ship_schedule','set_arrived_to_destination') || !viewState || !(['ship_depart','completed'].includes(record.status)),
      }
    },
    {
      label: 'Completed',
      props:{
        color: 'success',
        onClick: setComplete,
        hidden: !auth.isAuthorize('ship_schedule','set_completed') || !viewState || !(['arrived_to_destination'].includes(record.status)),
      }
    },
    {
      label: 'Batalkan',
      props:{
        color: 'danger',
        onClick: setCancel,
        hidden: !auth.isAuthorize('ship_schedule','set_cancelled') || !viewState || !(['port_processed','si_released'].includes(record.status)) || record.isNewRecord,
      }
    },

  ]

  async function addContainer(){
    const packingParam ={
      container: {
        ship_schedule_id: record.id
      }
    }

    const response = await auth.request(`/containers/${container.value}.json`,{method:'PUT',body: JSON.stringify(packingParam)})
    if(response.status === 200){
      addToast(
        (<CToast color='success' key={`add-container-${container.id}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Sukses Tambah</div>
          </CToastHeader>
          <CToastBody>Sukses tambah Packing List</CToastBody>
        </CToast>))
      setContainer({})
      containerTableRef.current.setSort([
          {column:"updated_at", dir:"desc"},
      ])

    }else if(response.status === 422){
      const result = await response.json()
      addToast(
        (<CToast color='danger' key={`failed-add-container-${container.value}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Gagal Tambah</div>
          </CToastHeader>
          <CToastBody>{result.message}</CToastBody>
        </CToast>))
    }
  }

  async function removeContainer(row){
    const packingParam ={
      container: {
        ship_schedule_id: null
      }
    }

    const response = await auth.request(`/containers/${row.id}.json`,{method:'PUT',body: JSON.stringify(packingParam)})
    if(response.status === 200){
      addToast(
        (<CToast color='success' key={`add-container-${row.id}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Sukses Lepas</div>
          </CToastHeader>
          <CToastBody>Sukses Lepas Packing List dari kontainer</CToastBody>
        </CToast>))
      containerTableRef.current.setSort([
          {column:"updated_at", dir:"desc"},
      ])

    }else if(response.status === 422){
      const result = await response.json()
      addToast(
        (<CToast color='danger' key={`failed-add-container-${container.id}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Gagal Tambah</div>
          </CToastHeader>
          <CToastBody>{result.message}</CToastBody>
        </CToast>))
    }
  }

  function renderActionButton(cell, formatterParams, onRendered){
    const row = cell.getData()
    onRendered(()=>{
      createRoot(cell.getElement()).render(
        <div className='action-buttons-container'>
          <CButton type='button' color='info' onClick={()=> window.open(`/packing_lists/${row.id}`,'_blank')}><Eye /></CButton>
          <CButton type='button' variant='outline' color='danger' onClick={()=> removeContainer(row)}><X/></CButton>
        </div>
      )})
  }

  function getContainerLabel(data){
    return data.container_number
  }

  const containerColumns = [
    {title:'Nomor Kontainer',field:'container_number',width:170},
    {title:'Nomor Segel',field:'seal_number',width:170},
    {title:'Jenis Pengiriman',field:'order_type',fieldType:'enum',enum:[{label:'LCL',value: 'less_container_load'},{label:'FCL',value: 'full_container_load'}],width:170},
    {title:'Kapal',field:'ship_name',fieldType:'link', linkLabel:'name',sortKey:'ships.name',recordPath: 'ship_path',filterField:'ship_schedules.ship_id',width:170},
    {title:'Agen Lorry',field:'agent_name',fieldType:'link', linkLabel:'name',sortKey:'agents.name',recordPath: 'agent_path',filterField:'agent_id',width:170},
    {title:'Tipe Kontainer',field:'container_type_name',fieldType:'link', linkLabel:'name',sortKey:'container_types.name',recordPath: 'container_type_path',filterField:'container_type_id',width:170},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'',field:"",fieldType:'action', formatter:renderActionButton,noSort: true,width: 150},
  ]

  return (
    <>
      <ConfirmModal ref={confirmModalRef}></ConfirmModal>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      <SiReleasedModalForm setVisible={setVisibleSiReleasedForm} refreshRecord={refreshRecord} visible={visibleSiReleasedForm} addToast={addToast} record={record} />
      <ShipDepartModalForm setVisible={setVisibleShipDepartForm} refreshRecord={refreshRecord} visible={visibleShipDepartForm} addToast={addToast} record={record} />
      <ShipArrivedModalForm setVisible={setVisibleShipArrivedForm} refreshRecord={refreshRecord} visible={visibleShipArrivedForm} addToast={addToast} record={record} />
      <ShipCompletedModalForm setVisible={setVisibleCompletedForm} refreshRecord={refreshRecord} visible={visibleCompletedForm} addToast={addToast} record={record} />
      <CCard>
        <CCardHeader>Form Jadwal Kapal
        <RecordActions record={record} className='float-end' actions={recordActions} />
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
                <CRow>
                  <CFormLabel htmlFor="status" className="col-form-label">
                    Status:
                  </CFormLabel>
                  <ShipScheduleStatusBadge value={record.status} />
                </CRow>
              </CCol>

              <CCol md={4} className='mb-3'>
                <CustomAsyncSelect readOnly={viewState} cacheOptions path='/ships.json' name='ship_id' label="Kapal"feedback={error.ship} onChange={changeSelectRecord} optionLabel="ship_name" value={{label: record.ship_name,value: record.ship_id}} placeholder="pilih kapal..." />
              </CCol>
              <CCol md={4} className='mb-3'>
                <CFormInput readOnly={viewState}  type="text" id="shipSchedule-voyage" label='Voyage' invalid={error.voyage != null}  feedback={error.voyage} name='voyage' onChange={changeRecord} value={record.voyage} placeholder="Voyage..."/>
              </CCol>
              <CCol md={4} className='mb-3'>
                <CustomAsyncSelect readOnly={viewState} cacheOptions path='/ports.json' name='loading_port_id' label="Pelabuhan Muatan"feedback={error.loading_port} onChange={changeSelectRecord} getOptionLabel={(line)=> `${line.city}(${line.name})`} optionLabel="loading_port_detail" value={{label: record.loading_port_detail,value: record.loading_port_id}} placeholder="pilih Pelabuhan..." />
              </CCol>
              <CCol md={4} className='mb-3'>
                <CustomAsyncSelect readOnly={viewState} cacheOptions path='/ports.json' name='destination_port_id' label="Pelabuhan Tujuan"feedback={error.destination_port} onChange={changeSelectRecord} getOptionLabel={(line)=> `${line.city}(${line.name})`} optionLabel="destination_port_detail" value={{label: record.destination_port_detail,value: record.destination_port_id}} placeholder="pilih Pelabuhan..." />
              </CCol>
              <CRow>
                <CCol md={4} className='mb-3'>
                  <KDatePicker readOnly={viewState} showTimeInput id="shipSchedule-estimated_arrived_sour_at" label='Estimasi Tanggal Kapal Mendarat Muatan' invalid={error.estimated_arrived_sour_at != null}  feedback={error.estimated_arrived_sour_at} name='estimated_arrived_sour_at' onChange={changeDateRecord} value={record.estimated_arrived_sour_at} />
                </CCol>
                <CCol md={4} className='mb-3'>
                  <KDatePicker readOnly={viewState} showTimeInput id="shipSchedule-actual_arrived_sour_at" label='Tanggal Aktual Kapal Mendarat Muatan' invalid={error.actual_arrived_sour_at != null}  feedback={error.actual_arrived_sour_at} name='actual_arrived_sour_at' onChange={changeDateRecord} value={record.actual_arrived_sour_at} />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={4} className='mb-3'>
                  <KDatePicker readOnly={viewState} showTimeInput id="shipSchedule-estimated_departure_sour_at" label='Estimasi Tanggal Berangkat' invalid={error.estimated_departure_sour_at != null}  feedback={error.estimated_departure_sour_at} name='estimated_departure_sour_at' onChange={changeDateRecord} value={record.estimated_departure_sour_at} />
                </CCol>
                <CCol md={4} className='mb-3'>
                  <KDatePicker readOnly={viewState} showTimeInput id="shipSchedule-actual_departure_sour_at" label='Tanggal Aktual Berangkat' invalid={error.actual_departure_sour_at != null}  feedback={error.actual_departure_sour_at} name='actual_departure_sour_at' onChange={changeDateRecord} value={record.actual_departure_sour_at} />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={4} className='mb-3'>
                  <KDatePicker readOnly={viewState} showTimeInput id="shipSchedule-estimated_arrived_dest_at" label='Estimasi Tanggal Kapal Sampai di Tujuan' invalid={error.estimated_arrived_dest_at != null}  feedback={error.estimated_arrived_dest_at} name='estimated_arrived_dest_at' onChange={changeDateRecord} value={record.estimated_arrived_dest_at} />
                </CCol>
                <CCol md={4} className='mb-3'>
                  <KDatePicker readOnly={viewState} showTimeInput id="shipSchedule-actual_arrived_dest_at" label='Tanggal Aktual Kapal Sampai di Tujuan' invalid={error.actual_arrived_dest_at != null}  feedback={error.actual_arrived_dest_at} name='actual_arrived_dest_at' onChange={changeDateRecord} value={record.actual_arrived_dest_at} />
                </CCol>
              </CRow>
              <CCol md={4} className='mb-3'>
                <KDatePicker readOnly={viewState} showTimeInput id="shipSchedule-dorry_container_opened_at" label='Tanggal Kontainer dibongkar di Tujuan' invalid={error.dorry_container_opened_at != null}  feedback={error.dorry_container_opened_at} name='dorry_container_opened_at' onChange={changeDateRecord} value={record.dorry_container_opened_at} />
              </CCol>
              <CCol md={4} className='mb-3'>
                <CFormInput readOnly={viewState} type="text" id="shipSchedule-booking_code" label='Kode Shipment Of Instruction' invalid={error.booking_code != null}  feedback={error.booking_code} name='booking_code' onChange={changeRecord} value={record.booking_code} />
              </CCol>

          </CCardBody>
          <CCardFooter hidden={viewState}>
            <CButton color="primary" type="submit">
              Simpan
            </CButton>
          </CCardFooter>
        </CForm>
      </CCard>
      <CCard className='mt-4' hidden={record.isNewRecord}>
        <CCardHeader>List Kontainer</CCardHeader>
        <CCardBody>
          <CRow className='mb-4' hidden={viewState}>
            <CCol md={4}>
              <CustomAsyncSelect
                path='/containers.json'
                getOptionLabel={getContainerLabel}
                name='container_id'
                label="Kontainer"
                filter={[{field:'ship_schedule_id',type:'not',value:record.id}]}
                onChange={(selectValue,metadata)=> setContainer(selectValue)}
                optionLabel='detail'
                value={container}
                placeholder="pilih Kontainer..." />
            </CCol>
            <CCol md={4} className='pt-4' >
                <CButton
                  color='primary'
                  onClick={addContainer}
                  variant='outline'
                  type='button'>Tambah <Plus/></CButton>
            </CCol>
          </CRow>
          <AsyncReactTabulator
            onRef={(ref) => containerTableRef.current = ref}
            columns={containerColumns}
            defaultFilter={[{field: 'ship_schedule_id',type:'=',value: record.id}]}
            ajaxURL='/containers.json' />
        </CCardBody>
      </CCard>
    </>
  )
}

export default ShipScheduleForm
