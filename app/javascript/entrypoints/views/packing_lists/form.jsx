import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CRow } from '@coreui/react'
import React  from 'react'
import { deleteRecord, saveRecord } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil, Printer } from '@phosphor-icons/react'
import  {CustomAsyncSelect}  from '~/components/CustomAsyncSelect'
import { UnitInput,NumberInput,MoneyInput } from '~/components/NumberInput'
import { useReactToPrint } from "react-to-print";
import InvoicePrint from './invoice_print'

const PackingListForm = () => {
  const printContentRef = React.useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: printContentRef,
    documentTitle:'Surat Jalan',
  });
  const company = {name: 'PT. Cipta Karya',city: 'Surabaya',address:'Jl Kalianget',contact_numbers:['021 32322','6282148473']}
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
  record.lines = [{description:'produk A',price: 300000},{description:'produk B',price: 600000}]

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false || progressBar > 0) {
      return;
    }

    let isNewRecord = record.isNewRecord
    saveRecord(record,progressOptions).then((result)=>{
      if(result.isSuccess && isNewRecord){
        navigate(`/packing_lists/${record.id}/edit`, {replace: true})
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

  function changeNumberRecord(event){
    let targetName = event.currentTarget.name
    record[targetName] = parseFloat(event.currentTarget.value)
    setRecord(record)
  }

  function changeSelectRecord(selectValue,metadata){
    let targetName = metadata.name
    record[targetName] = selectValue.value
    setRecord(record)
  }

  function confirmDelete(){
    deleteRecord(record).then((result)=>{
      if(result === true){
        setVisibleConfirmationDelete(false)
        addToast(
          (<CToast color='success' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Sukses</div>
            </CToastHeader>
            <CToastBody>Sukses hapus</CToastBody>
          </CToast>))
        navigate('packing_lists')
      }
    })
  }

  function toggleNavigate(){
    if(viewState){
      navigate(`/packing_lists/${record.id}/edit` )
    }else{
      navigate(`/packing_lists/${record.id}`)
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
        <CModalBody>Apakah Yakin Hapus Packing List {record.name} ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleConfirmationDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>Hapus</CButton>
        </CModalFooter>
      </CModal>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      <InvoicePrint company={company} record={record} ref={printContentRef} ></InvoicePrint>
      <CCard>
        <CCardHeader>Form Packing List

        <div className='float-end' hidden={record.isNewRecord}>
          <CButton hidden={!viewState} color='secondary' type='buttom' className='me-3' onClick={reactToPrintFn}>print Invoice <Printer /></CButton>
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
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/customers.json' name='sender_id' label="Pengirim" feedback={error.sender} onChange={changeSelectRecord} defaultValue={{label: record.sender_name,value: record.sender_id}}  />
            </CCol>
            <CCol md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/customers.json' name='receiver_id' label="Penerima" feedback={error.receiver} onChange={changeSelectRecord} defaultValue={{label: record.receiver_name,value: record.receiver_id}}  />
            </CCol>
            <CCol className='mb-3' md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/containers.json' name='container_id' label="Kontainer" feedback={error.container} onChange={changeSelectRecord} defaultValue={{label: record.container_number,value: record.container_id}}  />
            </CCol>
            <CCol className='mb-3' md={4}>
              <NumberInput readOnly={viewState} type="text" id="packingList-quantity" label='Jumlah' invalid={error.quantity != null}  feedback={error.quantity} name='quantity' onChange={changeNumberRecord} defaultValue={record.quantity} placeholder="Jumlah.."/>
            </CCol>
            <CCol className='mb-3' md={4}>
              <MoneyInput readOnly={viewState} type="text" id="packingList-price" label='Harga' invalid={error.price != null}  feedback={error.price} name='price' onChange={changeNumberRecord} defaultValue={record.price} placeholder="Harga.."/>
            </CCol>
            <CCol className='mb-3' md={4}>
              <UnitInput groupMeasurement='weight' uom={record.unit_of_measurement} onMeasurementChange={changeRecord} measurementName='unit_of_measurement' readOnly={viewState} type="text" id="packingList-totalWeight" label='Total Berat' invalid={error.total_weight != null}  feedback={error.total_weight} name='total_weight' onChange={changeNumberRecord} defaultValue={record.total_weight} placeholder="Berat.."/>
            </CCol>
            <CRow>
              <CCol className='mb-3' md={4}>
                <UnitInput groupMeasurement='length' uom={record.p_uom} onMeasurementChange={changeRecord} measurementName='p_uom' readOnly={viewState} type="text" id="packingList-totalDimensionP" label='Panjang' invalid={error.total_dimension_p != null}  feedback={error.total_dimension_p} name='total_dimension_p' onChange={changeNumberRecord} defaultValue={record.total_dimension_p} placeholder="Jumlah.."/>
              </CCol>
              <CCol className='mb-3' md={4}>
                <UnitInput groupMeasurement='length' uom={record.l_uom} onMeasurementChange={changeRecord} measurementName='l_uom' readOnly={viewState} type="text" id="packingList-totalDimensionL" label='Lebar' invalid={error.total_dimension_l != null}  feedback={error.total_dimension_l} name='total_dimension_l' onChange={changeNumberRecord} defaultValue={record.total_dimension_l} placeholder="Jumlah.."/>
              </CCol>
              <CCol className='mb-3' md={4}>
                <UnitInput groupMeasurement='length' uom={record.t_uom} onMeasurementChange={changeRecord} measurementName='t_uom' readOnly={viewState} type="text" id="packingList-totalDimensionT" label='Tinggi' invalid={error.total_dimension_t != null}  feedback={error.total_dimension_t} name='total_dimension_t' onChange={changeNumberRecord} defaultValue={record.total_dimension_t} placeholder="Jumlah.."/>
              </CCol>
            </CRow>
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

export default PackingListForm
