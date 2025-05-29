import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'
import { phoneFormat } from '~/lib/text_formatter'
import { Link } from 'react-router'

function UpperBody(){
  return(
    <div className='text-end mb-4'>
      <Link to="/customers/new">
        <CButton type='button' color="primary" role="button" variant='outline'>Tambah <Plus/></CButton>
      </Link>
    </div>
  )
}



const CustomerIndex = () => {

  const columns = [
    {title:'Nama',field:'name',width:150},
    {title:'Kontak',field:'contact_number',formatter: (cell)=>  phoneFormat(cell.getValue()),width:170},
    {title:'NPWP',field:'tax_account',width:170},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
  ]

  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Data Pelanggan</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='customers.json'
        />
    </>
  )
}

export default CustomerIndex
