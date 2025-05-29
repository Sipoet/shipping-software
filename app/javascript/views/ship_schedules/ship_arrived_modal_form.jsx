import React from "react"
import {CButton,CModal,CModalBody,CModalHeader,CModalTitle,CCol,CModalFooter,CToast,CToastBody,CToastHeader} from '@coreui/react'
import { AuthContext } from '~/lib/context'
import { changeCloneRecord } from '~/lib/form_helper'
import {KDatePicker} from '~/components/KDatePicker'
function ShipArrivedModalForm({setVisible,visible,record,addToast,refreshRecord}){
  const [auth,setAuth] = React.useContext(AuthContext)
  const [error, setError] = React.useState({})
  const [modalForm,setRecord] = React.useState({actual_arrived_dest_at:record.actual_arrived_dest_at})
  function changeDateRecord(date,name){
    setRecord((record)=> changeCloneRecord(record,[name,date]) )
  }

  async function setSiRelease(){
    const params = {
      ship_schedule:{
        actual_arrived_dest_at: modalForm.actual_arrived_dest_at
      }
    }
    let response = await auth.request(`/ship_schedules/${record.id}/set_arrived_to_destination.json`,{method:'POST',body: JSON.stringify(params)})
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
      aria-labelledby="shipArrivedModalForm"
    >
      <CModalHeader>
        <CModalTitle id="shipArrivedModalForm">Form Kapal Berangkat</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCol md={6} className='mb-3'>
          <KDatePicker showTimeInput required id="shipSchedule-actual_arrived_dest_at" label='Tanggal Aktual Kapal Sampai di Tujuan' invalid={error.actual_arrived_dest_at != null}  feedback={error.actual_arrived_dest_at} name='actual_arrived_dest_at' onChange={changeDateRecord} value={modalForm.actual_arrived_dest_at} />
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

export default ShipArrivedModalForm