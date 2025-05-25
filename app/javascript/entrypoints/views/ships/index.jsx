import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router'

function UpperBody(){
  return(
    <div className='text-end mb-4'>
      <Link to='/ships/new'>
        <CButton type='button' color="primary" role="button" variant='outline'>Tambah <Plus/></CButton>
      </Link>
    </div>


  )
}

const ShipIndex = () => {

  const columns = [
    {title:'Nama',field:'name'},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:170},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:170},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true}
  ]

  const options = {}
  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Data Kapal</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='ships.json'
        />
    </>
  )
}

export default ShipIndex
