import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'

function UpperBody(){
  return(
    <>
      <div className='text-end'>
        <CButton as="a" color="primary" href="/ship_schedules/new" role="button" variant='outline'>Tambah <Plus/></CButton>
      </div>
      <br />
    </>

  )
}

const ShipScheduleIndex = () => {

  const columns = [
    {title:'Kapal',field:'ship_name',width:170,fieldType:'link',linkLabel:'name',sortKey:'ships.name',recordPath: 'ship_path',filterField:'ship_id'},
    {title:'Status',field:'status',width:150,fieldType:'enum',enum:[{label:'draft',value:'draft'},{label:'completed',value:'completed'},{label:'cancelled',value:'cancelled'},{label:'port_processed',value:'port_processed'},{label:'ship_aboard',value:'ship_aboard'},{label:'si_released',value:'si_released'},{label:'arrived_to_destination',value:'arrived_to_destination'}]},
    {title:'Voyage',field:'voyage',width:170},
    {title:'Pelabuhan Muatan',field:'loading_port_detail',width:170, fieldType:'link',linkLabel:'name',sortKey:'loading_ports.name',recordPath: 'loading_port_path',filterField:'loading_port_id'},
    {title:'Pelabuhan Tujuan',field:'destination_port_detail',width:170, fieldType:'link',linkLabel:'name',sortKey:'destination_ports.name',recordPath: 'destination_port_path',filterField:'destination_port_id'},
    {title:'Tgl Estimasi Mendarat Muatan', field:'estimated_arrived_sour_at', fieldType:'datetime', width:150},
    {title:'Tgl Estimasi Berangkat', field:'estimated_departure_sour_at', fieldType:'datetime', width:150},
    {title:'Tgl Estimasi Mendarat Tujuan', field:'estimated_arrived_dest_at', fieldType:'datetime', width:150},
    {title:'Tgl Mendarat Muatan', field:'actual_arrived_sour_at', fieldType:'datetime', width:150},
    {title:'Tgl Berangkat', field:'actual_departure_sour_at', fieldType:'datetime', width:150},
    {title:'Tgl Mendarat Tujuan', field:'actual_arrived_dest_at', fieldType:'datetime', width:150},
    {title:'Tgl Bongkar Kontainer di Tujuan', field:'dorry_container_opened_at', fieldType:'datetime', width:150},
    {title:'Kode Booking',field:'booking_code',width:170},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
  ]

  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Jadwal Kapal</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='ship_schedules.json'
        />
    </>
  )
}

export default ShipScheduleIndex
