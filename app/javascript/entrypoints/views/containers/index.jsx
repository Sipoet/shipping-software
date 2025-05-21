import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'
function UpperBody(){
  return(
    <>
      <div className='text-end'>
        <CButton as="a" color="primary" href="#containers/new" role="button" variant='outline'>Tambah <Plus/></CButton>
      </div>
      <br />
    </>

  )
}

const ContainerIndex = () => {

  const columns = [
    {title:'Nomor Kontainer',field:'container_number',width:170},
    {title:'Nomor Segel',field:'seal_number',width:170},
    {title:'Jenis Pengiriman',field:'order_type',fieldType:'enum',enum:[{label:'LCL',value: 'less_container_load'},{label:'FCL',value: 'full_container_load'}],width:170},
    {title:'Kapal',field:'ship_name',fieldType:'link', linkLabel:'name',sortKey:'ships.name',recordPath: 'ship_path',filterField:'ship_schedules.ship_id',width:170},
    {title:'Jadwal Kapal',field:'ship_schedule_detail',fieldType:'link', linkLabel:'detail',sortKey:'ship_schedules.estimated_departure_sour_at',recordPath: 'ship_schedule_path',filterField:'ship_schedule_id',width:240},
    {title:'Agen Lorry',field:'agent_name',fieldType:'link', linkLabel:'name',sortKey:'agents.name',recordPath: 'agent_path',filterField:'agent_id',width:170},
    {title:'Tipe Kontainer',field:'container_type_name',fieldType:'link', linkLabel:'name',sortKey:'container_types.name',recordPath: 'container_type_path',filterField:'container_type_id',width:170},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:170}
  ]

  const options = {}
  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Data Kontainer</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='containers.json'
        />
    </>
  )
}

export default ContainerIndex
