import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CFormSelect,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CRow } from '@coreui/react'
import React  from 'react'
import {createRoot} from 'react-dom/client'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil, Plus, X } from '@phosphor-icons/react'
import  {CustomAsyncSelect}  from '~/components/CustomAsyncSelect'
import { dateFormat } from '~/lib/text_formatter'
import { AuthContext } from '~/lib/context'
import { createModel } from '~/lib/model'
import RecordActions from '~/components/RecordActions'
import {AsyncReactTabulator} from '~/components/async_react_tabulator'
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
  const packingListTableRef = React.useRef(0)
  const [packingList, setPackingList] = React.useState({})

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
          (<CToast color='success' key={'delete-container'}>
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

  async function addPackinglist(){
    const packingParam ={
      packing_list: {
        container_id: record.id
      }
    }

    const response = await auth.request(`/packing_lists/${packingList.value}.json`,{method:'PUT',body: JSON.stringify(packingParam)})
    if(response.status === 200){
      addToast(
        (<CToast color='success' key={`add-packing-list-${packingList.id}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Sukses Tambah</div>
          </CToastHeader>
          <CToastBody>Sukses tambah Packing List</CToastBody>
        </CToast>))
      setPackingList({})
      packingListTableRef.current.setSort([
          {column:"updated_at", dir:"desc"},
      ])

    }else if(response.status === 422){
      const result = await response.json()
      addToast(
        (<CToast color='danger' key={`failed-add-packing-list-${packingList.value}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Gagal Tambah</div>
          </CToastHeader>
          <CToastBody>{result.message}</CToastBody>
        </CToast>))
    }
  }

  async function removePackingList(row){
    const packingParam ={
      packing_list: {
        container_id: null
      }
    }

    const response = await auth.request(`/packing_lists/${row.id}.json`,{method:'PUT',body: JSON.stringify(packingParam)})
    if(response.status === 200){
      addToast(
        (<CToast color='success' key={`add-packing-list-${row.id}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Sukses Lepas</div>
          </CToastHeader>
          <CToastBody>Sukses Lepas Packing List dari kontainer</CToastBody>
        </CToast>))
      packingListTableRef.current.setSort([
          {column:"updated_at", dir:"desc"},
      ])

    }else if(response.status === 422){
      const result = await response.json()
      addToast(
        (<CToast color='danger' key={`failed-add-packing-list-${packingList.id}`}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Gagal Tambah</div>
          </CToastHeader>
          <CToastBody>{result.message}</CToastBody>
        </CToast>))
    }
  }

  function renderActionButtons(cell, formatterParams, onRendered){
    const row = cell.getData()
    onRendered(()=>{
      createRoot(cell.getElement()).render(
        <div className='action-buttons-container'>
          <CButton type='button' color='info' onClick={()=> window.open(`/packing_lists/${row.id}`,'_blank')}><Eye /></CButton>
          <CButton type='button' variant='outline' color='danger' onClick={()=> removePackingList(row)}><X/></CButton>
        </div>
      )})
  }

  function getPackingListLabel(data){
    return data.code
  }

  const recordActions = [
    {
      label: (<>Tambah <Plus /></>),
      props:{
        color: 'primary',
        variant: 'outline',
        onClick: () => navigate('/containers/new'),
        hidden: !auth.isAuthorize('container','create') || record.isNewRecord || !viewState,
      }
    },
    {
      label: (<>Edit <Pencil /></>),
      props:{
        color: 'info',
        onClick: toggleNavigate,
        hidden: !auth.isAuthorize('container','update') || record.isNewRecord || !viewState,
      }
    },
    {
      label: (<>Lihat <Eye /></>),
      props:{
        color: 'secondary',
        onClick: toggleNavigate,
        hidden: !auth.isAuthorize('container','read') || record.isNewRecord || viewState,
      }
    },
  ]

  const packingListColumns = [
    {title:'No Transaksi',field:"code", width: 180},
    {title:'Pengirim',field:"sender_name", fieldType:"link", filterField:"sender_id",  sortKey:"senders.name", linkLabel:"name", recordPath:"sender_path",width: 180},
    {title:'Penerima',field:"receiver_name", fieldType:"link", filterField:"receiver_id",  sortKey:"receivers.name", linkLabel:"name", recordPath:"receiver_path",width: 180},
    {title:'Total Berat(KG)',field:"total_weight", fieldType:'number',width: 180},
    {title:'Total Kubikasi(cm&sup3;)',field:"total_dimension", fieldType:'number',width: 180},
    {title:'Subtotal',field:"subtotal", fieldType:'money',width: 180},
    {title:'PPN',field:"tax_amount", fieldType:'money',width: 180},
    {title:'Grand Total',field:"grandtotal", fieldType:'money',width: 180},
    {title:'Total Barang',field:"total_item", fieldType:'number',width: 180},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'',field:"",fieldType:'action', formatter:renderActionButtons,noSort: true,width: 150},
  ]

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
              <CustomAsyncSelect isClearable readOnly={viewState} cacheOptions path='/ship_schedules.json' getOptionLabel={shipScheduleDetail} name='ship_schedule_id' label="Jadwal Kapal" feedback={error.ship_schedule} optionLabel='ship_schedule_detail' onChange={changeSelectRecord} value={record.ship_schedule_id ? {label: record.ship_schedule_detail,value: record.ship_schedule_id} : null} placeholder="pilih Jadwal kapal..." />
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
      <CCard className='mt-4' hidden={record.isNewRecord}>
        <CCardHeader>Packing List</CCardHeader>
        <CCardBody>
          <CRow className='mb-4' hidden={viewState}>
            <CCol md={4}>
              <CustomAsyncSelect
                path='/packing_lists.json'
                getOptionLabel={getPackingListLabel}
                name='packing_list_id'
                label="Packing List"
                filter={[{field:'container_id',type:'not',value:record.id}]}
                onChange={(selectValue,metadata)=> setPackingList(selectValue)}
                optionLabel='detail'
                value={packingList}
                placeholder="pilih Packing List..." />
            </CCol>
            <CCol md={4} className='pt-4' >
                <CButton
                  color='primary'
                  onClick={addPackinglist}
                  variant='outline'
                  type='button'>Tambah <Plus/></CButton>
            </CCol>
          </CRow>
          <AsyncReactTabulator
            onRef={(ref) => packingListTableRef.current = ref}
            columns={packingListColumns}
            defaultFilter={[{field: 'container_id',type:'=',value: record.id}]}
            ajaxURL='/packing_lists.json' />
        </CCardBody>
      </CCard>
    </>
  )
}

export default ContainerForm
