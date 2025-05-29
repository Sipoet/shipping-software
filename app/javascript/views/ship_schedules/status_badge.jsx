import React  from 'react'
import { CBadge } from '@coreui/react'
function ShipScheduleStatusBadge({value}){

  const colors ={
    draft: 'light',
    cancelled: 'danger',
    port_processed: 'info',
    si_released: 'info',
    ship_depart: 'info',
    arrived_to_destination: 'info',
    completed: 'success'
  }
  const labels = {
    draft: 'Draft',
    cancelled: 'Batal',
    port_processed: 'Konfirm',
    si_released: 'Shipment of Instruction keluar',
    ship_depart: 'Kapal Berangkat',
    arrived_to_destination: 'Kapal sampai di Tujuan',
    completed: 'Selesai'
  }
  React.useEffect(()=>{},[value])
  return(
    <h4>
      <CBadge color={colors[value]}>{labels[value]}</CBadge>
    </h4>
  )
}
export default ShipScheduleStatusBadge