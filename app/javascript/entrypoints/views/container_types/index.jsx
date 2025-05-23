import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'

function UpperBody(){
  return(
    <>
      <div className='text-end'>
        <CButton as="a" color="primary" href="/container_types/new" role="button" variant='outline'>Tambah <Plus/></CButton>
      </div>
      <br />
    </>

  )
}

const ContainerTypeIndex = () => {

  const columns = [
    {title:'Nama',field:'name',width:150},
    {title:'Berat',field:'weight',width:170},
    {title:'Berat',field:'weight',fieldType:'number',width:170},
    {title:'Panjang',field:'dimension_p',fieldType:'number',width:170},
    {title:'Lebar',field:'dimension_l',fieldType:'number',width:170},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
  ]

  const options = {}
  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Tipe Kontainer</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='container_types.json'
        />
    </>
  )
}

export default ContainerTypeIndex
