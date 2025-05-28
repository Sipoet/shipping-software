import {CAlert,CTableCaption,CCol,CForm,CButton,CTableHead,CTableRow,CTableBody,CTableDataCell,CTableHeaderCell,CModal,CModalBody,CCard,CCardHeader,CCardBody,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CRow, CFormTextarea, CTable } from '@coreui/react'
import React  from 'react'
import { FormHelper,changeCloneRecord } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil, Plus, Printer, X } from '@phosphor-icons/react'
import  {CustomAsyncSelect}  from '~/components/CustomAsyncSelect'
import { UnitInput,NumberInput,MoneyInput } from '~/components/NumberInput'
import { useReactToPrint } from "react-to-print";
import InvoicePrint from './invoice_print'
import { AuthContext } from '~/lib/context'
import {createModel} from '~/lib/model'

const PackingListForm = () => {
  const printContentRef = React.useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: printContentRef,
    documentTitle:'Surat Jalan',
  });
  const company = {name: 'PT. Cipta Karya',city: 'Surabaya',address:'Jl Kalianget',contact_numbers:['021 32322','6282148473']}
  const params = useLoaderData()
  params.record.packing_details ||= []
  const [record,setRecord] = React.useState(params.record)
  const [packingDetails,setPackingDetails] = React.useState(record.packing_details)
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

  function handleSubmit(event) {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false || progressBar > 0) {
      return
    }
    record.packing_details_attributes = packingDetails
    let isNewRecord = record.isNewRecord
    formHelper.saveRecord(record,progressOptions).then((result)=>{
      if(!result.isSuccess){
        setError(result.error)
        showErrorNotif(result.message)
        return
      }
      setError({})
      if(isNewRecord){
        navigate(`/packing_lists/${record.id}/edit`, {replace: true,state:{record: record}})
      }
      else{
        setRecord(result.record)
        showSuccessNotif(result.message)
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


  function changeNumberRecord(maskedValue,imask,event){
    const targetName = event.currentTarget.name
    const value = parseFloat(imask.unmaskedValue)
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function changeRecord(event){
    const targetName = event.currentTarget.name
    const value = event.currentTarget.value
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function changeSelectRecord(selectValue,metadata){
    setRecord((record)=> changeCloneRecord(record,[metadata.optionLabel,selectValue.label,metadata.name,selectValue.value]) )
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
  function addDetail(){
    let packingDetail = createModel('PackingDetail',{
      packing_list_id: record.id,_rowIndex: packingDetails.length,
      weight_uom:'kg',
      volume_uom:'m3',
      p_uom: 'm',
      l_uom: 'm',
      t_uom: 'm',
    })
    setPackingDetails([
      ...packingDetails,
      packingDetail
    ])
  }

  function removePackingDetail(record){
    if(record.isNewRecord){
      setPackingDetails(
        packingDetails.filter(a => a._rowIndex != record._rowIndex)
      )
    }else{
      record._destroy= true
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

      <CCard className='mb-3'>
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
            <CCol className='mb-3' md={4}>
              <CFormInput readOnly={viewState} id="packingList-code" label='Nota Transaksi' invalid={error.code != null}  feedback={error.code} name='code' onChange={changeRecord} value={record.code}   />
            </CCol>
            <CCol className='mb-3' md={4}>
              <CFormInput readOnly={viewState} type='datetime-local' id="packingList-transactionDate" label='Tanggal Transaksi' invalid={error.transaction_date != null}  feedback={error.transaction_date} name='transaction_date' onChange={changeRecord} value={record.transaction_date}   />
            </CCol>
            <CCol className='mb-3' md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/customers.json' name='sender_id' label="Pengirim" feedback={error.sender} onChange={changeSelectRecord} defaultValue={{label: record.sender_name,value: record.sender_id}}  />
            </CCol>
            <CCol className='mb-3' md={4}>
              <CustomAsyncSelect readOnly={viewState} cacheOptions path='/customers.json' name='receiver_id' label="Penerima" feedback={error.receiver} onChange={changeSelectRecord} defaultValue={{label: record.receiver_name,value: record.receiver_id}}  />
            </CCol>
            <CCol className='mb-3' md={4}>
              <CustomAsyncSelect readOnly={viewState} isClearable cacheOptions path='/containers.json' name='container_id' label="Kontainer" feedback={error.container} onChange={changeSelectRecord} defaultValue={{label: record.container_number,value: record.container_id}}  />
            </CCol>
            <CCol className='mb-3' md={4}>
              <CFormTextarea readOnly={viewState} id="packingList-description" label='Deskripsi' invalid={error.description != null}  feedback={error.description} name='description' onChange={changeRecord} value={record.description} />
            </CCol>

            <CRow className='mb-3'>
              <CCol md={4}>
                <CButton color='secondary' onClick={addDetail}>Tambah Detail <Plus/></CButton>
              </CCol>
            </CRow>

            <CTable caption="top" striped hover color='light' responsive>
              <CTableCaption>Packing details</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"><div className='width-50'>#</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Produk</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Deskripsi</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Jumlah</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Total Berat</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Total Kubikasi</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Panjang</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Lebar</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'>Tinggi</div></CTableHeaderCell>

                  <CTableHeaderCell scope="col"><div className='min-width-200'>Biaya Kirim</div></CTableHeaderCell>
                  <CTableHeaderCell scope="col"><div className='min-width-200'></div></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {packingDetails.map((line)=>{
                  return(
                    <PackingDetailRowForm removeRecord={removePackingDetail} key={line.id ||`new ${line._rowIndex}`} showErrorNotif={showErrorNotif} showSuccessNotif={showSuccessNotif}  record={line} />
                  )
                })}
              </CTableBody>
            </CTable>
            <CCol className='mb-3  mt-4' md={12}>
              <MoneyInput plainText readOnly={true} id="packingList-subtotal" label='Subtotal' invalid={error.subtotal != null}  feedback={error.subtotal} name='subtotal' onChange={changeNumberRecord} defaultValue={record.subtotal} />
            </CCol>
            <CCol className='mb-3' md={4}>
              <MoneyInput readOnly={viewState} id="packingList-taxAmount" label='PPN' invalid={error.tax_amount != null}  feedback={error.tax_amount} name='tax_amount' onChange={changeNumberRecord} defaultValue={record.tax_amount} />
            </CCol>
            <CCol className='mb-3' md={12}>
              <MoneyInput plainText readOnly={true} id="packingList-grandtotal" label='Grand Total' invalid={error.grandtotal != null}  feedback={error.grandtotal} name='grandtotal' onChange={changeNumberRecord} defaultValue={record.grandtotal} />
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

function PackingDetailRowForm(props){
  const [record,setRecord] = React.useState(props.record)
  const [error, setError] = React.useState(props.error||{})


  function changeNumberRecord(maskedValue,imask,event){
    const targetName = event.currentTarget.name
    const value = parseFloat(imask.unmaskedValue)
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function changeRecord(event){
    const targetName = event.currentTarget.name
    const value = event.currentTarget.value
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function changeSelectRecord(selectValue,metadata){
    setRecord((record)=> changeCloneRecord(record,[metadata.optionLabel,selectValue.label,metadata.name,selectValue.value]) )
  }

  return (
    <CTableRow key={record.id || `newRow${props.rowOrder}`}>
      <CTableHeaderCell scope="row">{props.rowOrder}</CTableHeaderCell>
      <CTableDataCell><CustomAsyncSelect cacheOptions path='/products.json' name='product_id' feedback={error.product} onChange={changeSelectRecord} defaultValue={{label: record.product_name,value: record.product_id}}  /></CTableDataCell>
      <CTableDataCell><CFormTextarea invalid={error.description != null}  feedback={error.description} name='description' onChange={changeRecord} value={record.description} /></CTableDataCell>
      <CTableDataCell><NumberInput invalid={error.quantity != null}  feedback={error.quantity} name='quantity' onChange={changeNumberRecord} defaultValue={record.quantity} placeholder="Jumlah.."/></CTableDataCell>
      <CTableDataCell><UnitInput groupMeasurement='weight' uom={record.weight_uom} onMeasurementChange={changeRecord} measurementName='weight_uom' invalid={error.total_weight != null}  feedback={error.total_weight} name='total_weight' onChange={changeNumberRecord} defaultValue={record.total_weight} placeholder="Berat.."/></CTableDataCell>
      <CTableDataCell><UnitInput groupMeasurement='volume' uom={record.volume_uom} onMeasurementChange={changeRecord} measurementName='volume_uom' invalid={error.total_volume != null}  feedback={error.total_volume} name='total_volume' onChange={changeNumberRecord} defaultValue={record.total_volume} placeholder="volume.."/></CTableDataCell>
      <CTableDataCell><UnitInput groupMeasurement='length' uom={record.p_uom} onMeasurementChange={changeRecord} measurementName='p_uom' invalid={error.total_dimension_p != null}  feedback={error.total_dimension_p} name='total_dimension_p' onChange={changeNumberRecord} defaultValue={record.total_dimension_p} /></CTableDataCell>
      <CTableDataCell><UnitInput groupMeasurement='length' uom={record.l_uom} onMeasurementChange={changeRecord} measurementName='l_uom' invalid={error.total_dimension_l != null}  feedback={error.total_dimension_l} name='total_dimension_l' onChange={changeNumberRecord} defaultValue={record.total_dimension_l} /></CTableDataCell>
      <CTableDataCell><UnitInput groupMeasurement='length' uom={record.t_uom} onMeasurementChange={changeRecord} measurementName='t_uom' invalid={error.total_dimension_t != null}  feedback={error.total_dimension_t} name='total_dimension_t' onChange={changeNumberRecord} defaultValue={record.total_dimension_t} /></CTableDataCell>

      <CTableDataCell >
        <MoneyInput invalid={error.send_cost != null}  feedback={error.send_cost} name='send_cost' onChange={changeNumberRecord} defaultValue={record.send_cost} />
      </CTableDataCell>
      <CTableDataCell>
        <CButton type='button' className='me-4' onClick={()=> props.removeRecord(record)} color='danger'><X /></CButton>
      </CTableDataCell>
    </CTableRow>
  )
}

export default PackingListForm
