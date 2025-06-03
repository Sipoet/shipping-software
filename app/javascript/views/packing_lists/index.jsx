import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router'

function UpperBody(){
  return(
    <div className='text-end mb-4'>
      <Link to='/packing_lists/new'>
        <CButton type='button' color="primary" role="button" variant='outline'>Tambah <Plus/></CButton>
      </Link>
    </div>
  )
}

const PackingListIndex = () => {

  const columns = [
    {title:'No Transaksi',field:"code", width: 180},
    {title:'Kontainer',field:"container_number", fieldType:"link", filterField:"container_id",  sortKey:"containers.container_number", linkLabel:"name", recordPath:"container_path",width: 180},
    {title:'Pengirim',field:"sender_name", fieldType:"link", filterField:"sender_id",  sortKey:"senders.name", linkLabel:"name", recordPath:"sender_path",width: 180},
    {title:'Penerima',field:"receiver_name", fieldType:"link", filterField:"receiver_id",  sortKey:"receivers.name", linkLabel:"name", recordPath:"receiver_path",width: 180},
    {title:'Total Berat(KG)',field:"total_weight", fieldType:'number',width: 180},
    {title:'Total Kubikasi(cm&sup3;)',field:"total_dimension", fieldType:'number',width: 180},
    {title:'Subtotal',field:"subtotal", fieldType:'money',width: 180},
    {title:'PPN',field:"tax_amount", fieldType:'money',width: 180},
    {title:'Grand Total',field:"grandtotal", fieldType:'money',width: 180},
    {title:'Total Barang',field:"total_item", fieldType:'number',width: 180},
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
