import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'
import { phoneFormat } from '~/lib/text_formatter'

function UpperBody(){
  return(
    <>
      <div className='text-end'>
        <CButton as="a" color="primary" href="/agents/new" role="button" variant='outline'>Tambah <Plus/></CButton>
      </div>
      <br />
    </>

  )
}



const AgentIndex = () => {

  const columns = [
    {title:'Nama',field:'name',width:150},
    {title:'Kontak',field:'contact_number',formatter: (cell)=> phoneFormat(cell.getData()),width:170},
    {title:'NPWP',field:'tax_account',width:170},
    {title:'Pelabuhan Default',field:'default_port',fieldType:'link',width:170,linkLabel:'name',sortKey:'default_ports.name',recordPath: 'default_port_path',filterField:'default_port_id'},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
  ]

  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Data Agen Lorry</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='agents.json'
        />
    </>
  )
}

export default AgentIndex
