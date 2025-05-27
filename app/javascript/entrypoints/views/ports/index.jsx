import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'
import {capitalize} from 'lodash'
import { Link } from 'react-router'

function UpperBody(){
  return(
    <div className='text-end mb-4'>
      <Link to='/ports/new'>
        <CButton color="primary" role="button" variant='outline'>Tambah <Plus/></CButton>
      </Link>
    </div>
  )
}

function PortIndex(){
  const columns = [
    {title:'Nama',field:'name',width:180},
    {title:'Kabupaten/Kota',field:'city',formatter:(cell)=>{return capitalize(cell.getData().city)},width:190},
    {title:'Negara',formatter:(cell)=>{return capitalize(cell.getData().country)}, field:'country',width:150},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action', rowButtons:['view','edit'],noSort: true, width:200}
  ]

  const options = {}
  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Data Pelabuhan</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='ports.json'
        />
    </>
  )
}

export default PortIndex
