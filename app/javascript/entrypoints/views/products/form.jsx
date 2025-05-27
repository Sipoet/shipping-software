import {CAlert, CCol,CForm,CButton,CCard,CCardHeader,CCardBody,CCardFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CFormSelect, CRow } from '@coreui/react'
import React  from 'react'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import ConfirmModal from '~/components/ConfirmModal'
import { UnitInput } from '~/components/NumberInput'
import { AuthContext } from '~/lib/context'
import { createModel } from '~/lib/model'

const ProductForm = () => {
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
        navigate(`/products/${record.id}/edit`, {replace: true})
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
        navigate('/products')
      }
    })


  }

  function toggleNavigate(){
    if(viewState){
      navigate(`/products/${record.id}/edit` )
    }else{
      navigate(`/products/${record.id}`)
    }
  }

  return (
    <>
      <ConfirmModal title="Konfirmasi Hapus" description="Apakah anda yakin hapus?" submitLabel="Submit" ref={modalRef} resolving={confirmDelete} />
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CCard>
        <CCardHeader>Form Produk

        <div className='float-end' hidden={record.isNewRecord}>
          <CButton color={viewState ? 'secondary' : 'info'} type="button" className='me-3' onClick={toggleNavigate}>
              {viewState ?  (<>Edit <Pencil /></>): (<>Lihat <Eye /></>) }
          </CButton>
          <CButton color="danger" type="button" onClick={()=> modalRef.current.openModal()}>
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
            <CCol className='mb-4' md={4}>
              <CFormInput readOnly={viewState} type="text" id="product-name" label='Nama Produk' invalid={error.name != null}  feedback={error.name} name='name' onChange={changeRecord} value={record.name}/>
            </CCol>
            <CCol className='mb-4' md={4}>
              <CFormSelect readOnly={viewState} type="text" id="product-productType" label='Tipe Produk' invalid={error.product_type != null}  feedback={error.product_type} name='product_type' onChange={changeRecord} value={record.product_type}>
                <option>Pilih ...</option>
                <option value='foods'>Makanan & Minuman</option>
                <option value='electronic_appliance'>Elektronik</option>
                <option value='chemical'>Bahan Kimia</option>
                <option value='cosmetics'>Kosmetik</option>
                <option value='building_tools'>Alat Bangunan</option>
                <option value='furniture'>Perkakas</option>
                <option value='other'>Yang lain</option>
              </CFormSelect>
            </CCol>
            <CCol className='mb-4' md={4}>
              <UnitInput readOnly={viewState} groupMeasurement='weight' type="text" id="product-weight" label='Berat' invalid={error.weight != null}  feedback={error.weight} name='weight' onChange={changeRecord} value={record.weight}/>
            </CCol>
            <CRow>
              <CCol md={4}>
                <UnitInput readOnly={viewState} groupMeasurement='length' type="text" id="product-dimension_p" label='Panjang' invalid={error.dimension_p != null}  feedback={error.dimension_p} name='dimension_p' onChange={changeRecord} value={record.dimension_p}/>
              </CCol>
              <CCol md={4}>
                <UnitInput readOnly={viewState} groupMeasurement='length' type="text" id="product-dimension_l" label='Lebar' invalid={error.dimension_l != null}  feedback={error.dimension_l} name='dimension_l' onChange={changeRecord} value={record.dimension_l}/>
              </CCol>
              <CCol md={4}>
                <UnitInput readOnly={viewState} groupMeasurement='length' type="text" id="product-dimension_t" label='Tinggi' invalid={error.dimension_t != null}  feedback={error.dimension_t} name='dimension_t' onChange={changeRecord} value={record.dimension_t}/>
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

export default ProductForm
