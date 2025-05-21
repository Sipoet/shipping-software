import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'

function UpperBody(){
  return(
    <>
      <div className='text-end'>
        <CButton as="a" color="primary" href="#packing_lists/new" role="button" variant='outline'>Tambah <Plus/></CButton>
      </div>
      <br />
    </>

  )
}

const PackingListIndex = () => {

  const columns = [
    {title:'Produk',field:"product_detail", fieldType:"link", filterField:"product_id",  sortKey:"products.name", linkLabel:"name", recordPath:"product_path",width: 180},
    {title:'Kontainer',field:"container_detail", fieldType:"link", filterField:"container_id",  sortKey:"containers.container_number", linkLabel:"name", recordPath:"container_path",width: 180},
    {title:'Pelanggan / CLient',field:"customer_detail", fieldType:"link", filterField:"customer_id",  sortKey:"customers.name", linkLabel:"name", recordPath:"customer_path",width: 180},
    {title:'Supplier',field:"supplier_detail", fieldType:"link", filterField:"supplier_id",  sortKey:"suppliers.name", linkLabel:"name", recordPath:"supplier_path",width: 180},
    {title:'Jumlah',field:"quantity", fieldType:'number',width: 180},
    {title:'Total Berat(KG)',field:"total_weight", fieldType:'number',width: 180},
    {title:'Harga',field:"price", fieldType:'money',width: 180},
    {title:'Satuan',field:"unit_of_measurement",width: 180},
    {title:'Total Kubikasi(cm&sup3;)',field:"total_dimension", fieldType:'number',width: 180},
    {title:'Panjang(cm)',field:"total_dimension_p", fieldType:'number', width: 150},
    {title:'Lebar(cm)',field:"total_dimension_l", fieldType:'number', width: 150},
    {title:'Tinggi(cm)',field:"total_dimension_t", fieldType:'number', width: 150},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
  ]

  const options = {}
  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Packing List</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='packing_lists.json'
        />
    </>
  )
}

export default PackingListIndex
