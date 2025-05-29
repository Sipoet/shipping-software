import React from "react"
import {CButton,CModal,CModalBody,CModalHeader,CModalTitle,CCol,CModalFooter,CToast,CToastBody,CToastHeader,CFormInput, CForm} from '@coreui/react'
import { AuthContext } from '~/lib/context'
import { changeCloneRecord } from '~/lib/form_helper'
import {KDatePicker} from '~/components/KDatePicker'
function SiReleasedModalForm({setVisible,visible,record,addToast,refreshRecord}){
  const [auth,setAuth] = React.useContext(AuthContext)
  const [error, setError] = React.useState({})
  const [modalForm,setRecord] = React.useState({booking_code: record.booking_code,actual_arrived_sour_at: record.actual_arrived_sour_at})
  function changeRecord(event){
    const targetName = event.currentTarget.name
    const value = event.currentTarget.value
    setRecord((record)=> changeCloneRecord(record,[targetName,value]) )
  }

  function changeDateRecord(date,name){
    setRecord((record)=> changeCloneRecord(record,[name,date]) )
  }

  async function setSiRelease(){
    const params = {
      ship_schedule:{
        actual_arrived_sour_at: modalForm.actual_arrived_sour_at,
        booking_code: modalForm.booking_code
      }
    }
    let response = await auth.request(`/ship_schedules/${record.id}/set_si_released.json`,{method:'POST',body: JSON.stringify(params)})
    if(response.status === 200){
      const result = await response.json()
      addToast(
        (<CToast color='success' key={'toast-form'}>
          <CToastHeader closeButton>
            <div className="fw-bold me-auto">Sukses</div>
          </CToastHeader>
          <CToastBody>{result.message}</CToastBody>
        </CToast>))
      setVisible(false)
      refreshRecord()
    }else if(response.status === 422){
      const result = await response.json()
      setError(result.error)
    }else{
      const result = await response.text()
      console.error(result)
    }

  }

  React.useEffect(()=>{},[record,visible])
  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="siReleasedModalForm"
    >
      <CModalHeader>
        <CModalTitle id="siReleasedModalForm">Form SI Keluar </CModalTitle>
      </CModalHeader>
      <CForm>
        <CModalBody>
          <CCol md={8} className='mb-3'>
            <KDatePicker showTimeInput required id="shipSchedule-actual_arrived_sour_at" label='Tanggal Aktual Kapal Mendarat Muatan' invalid={error.actual_arrived_sour_at != null}  feedback={error.actual_arrived_sour_at} name='actual_arrived_sour_at' onChange={changeDateRecord} value={modalForm.actual_arrived_sour_at} />
          </CCol>
          <CCol md={8} className='mb-3'>
            <CFormInput type="text" required id="shipSchedule-booking_code" label='Kode Shipment Of Instruction' invalid={error.booking_code != null}  feedback={error.booking_code} name='booking_code' onChange={changeRecord} value={modalForm.booking_code} />
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={setSiRelease}>Submit</CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )


}

export default SiReleasedModalForm