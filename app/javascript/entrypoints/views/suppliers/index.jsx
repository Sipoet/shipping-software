import React  from 'react'
import { AsyncReactTabulator } from '../../vendors/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'

function UpperBody(){
  return(
    <>
      <div className='text-end'>
        <CButton as="a" color="primary" href="#ships/new" role="button" variant='outline'>Tambah <Plus/></CButton>
      </div>
      <br />
    </>

  )
}

const ShipIndex = () => {

  const columns = [
    {title:'Nama',field:'name',width:150},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
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
