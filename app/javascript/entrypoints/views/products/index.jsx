import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'

function UpperBody(){
  return(
    <>
      <div className='text-end'>
        <CButton as="a" color="primary" href="#products/new" role="button" variant='outline'>Tambah <Plus/></CButton>
      </div>
      <br />
    </>

  )
}

const ProductIndex = () => {

  const columns = [
    {title:'Nama',field:'name',width:170},
    {title:'Tipe Produk',field:'product_type',fieldType:'enum',enum:[
    {label: 'other', value: 'other'},
    {label: 'foods', value: 'foods'},
    {label: 'electronic_appliance', value: 'electronic_appliance'},
    {label: 'chemical', value: 'chemical'},
    {label: 'cosmetics', value: 'cosmetics'},
    {label: 'building_tools', value: 'building_tools'},
    {label: 'furniture', value: 'furniture'},
  ],width:170},
    {title:'Berat',field:'weight',fieldType:'number',width:170},
    {title:'Panjang',field:'dimension_p',fieldType:'number',width:170},
    {title:'Lebar',field:'dimension_l',fieldType:'number',width:170},
    {title:'Tinggi',field:'dimension_t',width:170},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
  ]

  const options = {}
  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Data Produk</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='products.json'
        />
    </>
  )
}

export default ProductIndex
