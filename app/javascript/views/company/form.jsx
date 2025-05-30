import {CAlert, CCol,CForm,CButton,CImage,CCard,CCardHeader,CCardBody,CCardFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CFormTextarea, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect } from '@coreui/react'
import React  from 'react'
import { changeCloneRecord } from '~/lib/form_helper'
import { useOutletContext } from 'react-router'
import { PhoneInput } from '~/components/NumberInput'
import { AuthContext } from '~/lib/context'
import { CompanyContext } from '~/lib/context'
import { Plus, X } from '@phosphor-icons/react'

const CompanyForm = () => {
  const [company,setCompany] = React.useContext(CompanyContext)
  const [record,setRecord] = React.useState(company)
  const [visible, setVisible] = React.useState(false)
  const [status, setStatus] = React.useState('info')
  const [message, setMessage] = React.useState('')
  const [toast, addToast] = React.useState()
  const [error, setError] = React.useState({})
  const toaster = React.useRef(null)
  const [progressBar,setProgressBar,progressColor,setProgressColor] = useOutletContext()
  const progressOptions ={progressBar,setProgressBar,progressColor,setProgressColor,showProgress: true}
  const [auth,setAuth] = React.useContext(AuthContext)
  const fieldKeys = [
    'name','address', 'bank', 'bank_account',
    'company_image_name','company_icon_name',
    'bank_register_name', 'city', 'tax_account']
  React.useEffect(()=>{setRecord(company)},[company])
  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false || progressBar > 0) {
      return;
    }
    setProgressBar(1)
    setProgressColor('info')
    let progressInterval = setInterval(() => {
      setProgressBar((prog)=> prog+1)
    }, 500);
    const formData  = new FormData();
    fieldKeys.forEach((key)=>{
      if(record[key] != null){
        formData.append(`company[${key}]`,record[key])
      }
    })
    for(let index=0; index< record.contact_numbers.length;index++){
      const contactNumber = record.contact_numbers[index]
      formData.append(`company[contact_numbers][][contact_type]`,contactNumber.contact_type)
      formData.append(`company[contact_numbers][][value]`,contactNumber.value)
    }
    if(record.company_image_file != null){
      formData.append('company[company_image]',record.company_image_file)
    }

    if(record.company_icon_file != null){
      formData.append('company[company_icon]',record.company_icon_file)
    }

    auth
      .request('/system_settings/company.json',{
        method: 'PUT',
        noContentType: true,
        body: formData
      }).then((response)=>{
      if(response.status === 200){
        response.json().then((result)=>{
          setError({})
          setRecord(result.data)
          setCompany(result.data)
          showSuccessNotif(result.message)
          setProgressBar(100)
          setProgressColor('success')
        })

      }else if(response.status == 422){
        response.json().then((result)=>{
          setError(result.error)
          showErrorNotif(result.message)
          setProgressBar(100)
          setProgressColor('danger')
          setProgressBar(0)
        })
      }else{
        response.text().then((result)=>{
          console.error(result)
          setProgressBar(100)
          setProgressColor('danger')
          setProgressBar(0)
        })
      }
    }).finally(()=>{
      setProgressBar(0)
      setProgressColor('info')
      setTimeout(()=>{
        setProgressBar(0)
        setProgressColor('info')
      },700)
      clearInterval(progressInterval)
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

  function changeRecord(event){
    const targetName = event.currentTarget.name
    const value = event.currentTarget.value
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function addContactNumber(){
    const cont= [...record.contact_numbers,{index: Math.random() * 10 }]
    setRecord((record)=> changeCloneRecord(record,['contact_numbers',cont]) )
  }

  function changeImageRecord(event) {
    const targetName = event.currentTarget.name
    const value = event.currentTarget.value
    setRecord((record)=> changeCloneRecord(record,[`${targetName}_name`,value]) )
    let selectedFile = event.target.files[0];
    setRecord((record)=> changeCloneRecord(record,[`${targetName}_file`,selectedFile]) )
    let reader = new FileReader();
    reader.onload = function(ev) {
      console.log(`${targetName}_path`)
      setRecord((record)=> changeCloneRecord(record,[`${targetName}_path`,ev.target.result]) )
    };
    reader.readAsDataURL(selectedFile);
  }

  function removeContactNumber(contactNumber){
    const newCont = record.contact_numbers.filter((line)=> line.index !== contactNumber.index)
    setContactNumbers(newCont)
  }

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      <CCard>
        <CCardHeader>Form Perusahaan
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
            <CCol md={4} className='mb-4'>
              <CFormInput type="text" id="company-name" label='Nama Perusahaan' invalid={error.name != null}  feedback={error.name} name='name' onChange={changeRecord} value={record.name} />
            </CCol>
            <CCol md={4} className='mb-4'>
              <CFormInput type="text" id="company-city" label='Kota' invalid={error.city != null}  feedback={error.city} name='city' onChange={changeRecord} value={record.city} />
            </CCol>
            <CCol md={4} className='mb-4'>
              <CFormTextarea type="text" id="company-address" label='Alamat' invalid={error.address != null}  feedback={error.address} name='address' onChange={changeRecord} value={record.address} />
            </CCol>
            <CCol md={4} className='mb-4'>
              <CFormInput type="text" id="company-bank" label='Bank' invalid={error.bank != null}  feedback={error.bank} name='bank' onChange={changeRecord} value={record.bank} />
            </CCol>
            <CCol md={4} className='mb-4'>
              <CFormInput type="text" id="company-bankRegisterName" label='Nama pemilik rekening' invalid={error.bank_register_name != null}  feedback={error.bank_register_name} name='bank_register_name' onChange={changeRecord} value={record.bank_register_name} />
            </CCol>
            <CCol md={4} className='mb-4'>
              <CFormInput type="text" id="company-bankAccount" label='Nomor Rekening' invalid={error.bank_account != null}  feedback={error.bank_account} name='bank_account' onChange={changeRecord} value={record.bank_account} />
            </CCol>
            <CCol md={4} className='mb-4'>
              <CFormInput type="text" id="company-taxAccount" label='NPWP' invalid={error.tax_account != null}  feedback={error.tax_account} name='tax_account' onChange={changeRecord} value={record.tax_account} />
            </CCol>
            <CTable hidden={record.contact_numbers.length === 0}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope='col'>Jenis Kontak</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>Nomor</CTableHeaderCell>
                  <CTableHeaderCell scope='col'></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {record.contact_numbers.map(contactNumber =>(
                  <ContactNumberForm record={contactNumber} key={contactNumber.index} removeRecord={removeContactNumber} />
                ))}
              </CTableBody>
            </CTable>
            <CCol md={4} className='mb-4'>
              <CButton onClick={addContactNumber} color='secondary'>Tambah Kontak <Plus/></CButton>
            </CCol>
            <CCol md={4} className='mb-4'>
               <CImage thumbnail hidden={record.company_image_name == null} src={record.company_image_path} width={200} height={100} />
              <CFormInput accept="image/*" type="file" id="company-companyImage" onChange={changeImageRecord} label="Gambar Perusahaan" name='company_image' invalid={error.company_image != null}  feedback={error.company_image} defaultValue={record.company_image_name} value={record.company_image}  />
            </CCol>
            <CCol md={4} className='mb-4'>
               <CImage thumbnail hidden={record.company_icon_name == null} src={record.company_icon_path} width={100} height={100} />
              <CFormInput accept="image/*" type="file" id="company-companyImage" onChange={changeImageRecord} label="Logo Perusahaan" name='company_icon' invalid={error.company_icon != null}  feedback={error.company_icon} defaultValue={record.company_icon_name} value={record.company_icon}  />
            </CCol>
          </CCardBody>
          <CCardFooter>
            <CButton color="primary" type="submit">
              Simpan
            </CButton>
          </CCardFooter>
        </CForm>
      </CCard>



    </>
  )
}

function ContactNumberForm(props){
  const [record,setRecord] = React.useState(props.record)
  function changeRecord(event){
    const targetName = event.currentTarget.name
    const value = event.currentTarget.value
    props.record[targetName] = value
    setRecord((old)=> changeCloneRecord(old,[targetName,value]) )
  }

  function changePhoneRecord(maskedValue,imask,event){
    const targetName = imask.el.input.name
    props.record[targetName] = imask.unmaskedValue
    setRecord((old)=> changeCloneRecord(old,[targetName,imask.unmaskedValue]) )
  }

  const contactNumberTypes = [
    {label:''},
    {label:'No HP', value:'phone'},
    {label:'Telepon', value:'tel'},
    {label:'Whatsapp', value:'wa'},
    {label:'Fax', value:'fax'},
  ]

  React.useEffect(()=>{},[record])
  return (
    <CTableRow key={record.index}>
      <CTableDataCell>
        <CFormSelect options={contactNumberTypes} name='contact_type' onChange={changeRecord} value={record.contact_type} />
      </CTableDataCell>
      <CTableDataCell>
        <PhoneInput value={record.value} name='value' onChange={changePhoneRecord} />
      </CTableDataCell>
      <CTableDataCell>
        <CButton onClick={()=>props.removeRecord(record)}><X/></CButton>
      </CTableDataCell>
    </CTableRow>
  )
}

export default CompanyForm
