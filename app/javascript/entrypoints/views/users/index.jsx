import React  from 'react'
import { AsyncReactTabulator } from '~/components/async_react_tabulator'
import {Plus} from '@phosphor-icons/react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router'

function UpperBody(){
  return(
    <div className='text-end mb-4'>
      <Link to="/users/new">
        <CButton color="primary" role="button" variant='outline'>Tambah <Plus/></CButton>
      </Link>
    </div>
  )
}

const UserIndex = () => {

  const columns = [
    {title:'Username',field:'username',width:170},
    {title:'Status',field:'status',width:170},
    {title:'Jabatan',field:'role_name',width:170, fieldType:'link',linkLabel:'name',sortKey:'roles.name',recordPath: 'role_path',filterField:'role_id'},
    {title:'Email',field:'email',width:170},
    {title:'Tanggal Dibuat', field:'created_at', fieldType:'datetime', width:150},
    {title:'Tanggal Diubah', field:'updated_at', fieldType:'datetime', width:150},
    {title:'', field:'action', fieldType:'action',rowButtons:['view','edit'],noSort: true, width:200}
  ]

  const options = {}
  var tableRef = React.useRef(0)
  return (
    <>
      <h1>Data User</h1>
      <UpperBody/>
      <AsyncReactTabulator
          onRef={(ref) => (tableRef = ref)}
          columns={columns}
          ajaxURL='users.json'
        />
    </>
  )
}

export default UserIndex
