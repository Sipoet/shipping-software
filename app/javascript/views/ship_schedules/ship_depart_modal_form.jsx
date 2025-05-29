import React from "react"
import {CButton,CModal,CModalBody,CModalHeader,CModalTitle,CCol,CModalFooter,CToast,CToastBody,CToastHeader} from '@coreui/react'
import { AuthContext } from '~/lib/context'
import { changeCloneRecord } from '~/lib/form_helper'
import {KDatePicker} from '~/components/KDatePicker'
function ShipDepartModalForm({setVisible,visible,record,addToast,refreshRecord}){
  const [auth,setAuth] = React.useContext(AuthContext)
  const [error, setError] = React.useState({})
  const [modalForm,setRecord] = React.useState({actual_departure_sour_at: record.actual_departure_sour_at})
  function changeDateRecord(date,name){
    setRecord((record)=> changeCloneRecord(record,[name,date]) )
  }

  async function setSiRelease(){
    const params = {
      ship_schedule:{
        actual_departure_sour_at: modalForm.actual_departure_sour_at
      }
    }
    let response = await auth.request(`/ship_schedules/${record.id}/set_ship_depart.json`,{method:'POST',body: JSON.stringify(params)})
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
      aria-labelledby="shipDepartModalForm"
    >
      <CModalHeader>
        <CModalTitle id="shipDepartModalForm">Form Kapal Berangkat</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCol md={6} className='mb-3'>
          <KDatePicker showTimeInput required id="shipSchedule-actual_departure_sour_at" label='Tanggal Aktual Berangkat' invalid={error.actual_departure_sour_at != null}  feedback={error.actual_departure_sour_at} name='actual_departure_sour_at' onChange={changeDateRecord} value={modalForm.actual_departure_sour_at} />
        </CCol>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Batal
        </CButton>
        <CButton color="primary" onClick={setSiRelease}>Submit</CButton>
      </CModalFooter>
    </CModal>
  )


}

export default ShipDepartModalForm