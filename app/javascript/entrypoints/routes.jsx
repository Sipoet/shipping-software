import React from 'react'
import { createBrowserRouter,data,redirectDocument,isRouteErrorResponse,NavLink,useNavigate,useRouteError } from 'react-router'
import DefaultLayout from '~/views/layouts/default_layout'
import { FormHelper } from '~/lib/form_helper'
import { createModel } from '~/lib/model'
import {Auth} from '~/lib/auth'
import { CSpinner } from '@coreui/react'
import {snakeCase} from 'lodash'

const Dashboard = React.lazy(() => import('~/views/home/Dashboard'))
const CustomerData = React.lazy(() => import('~/views/customers/index'))
const CustomerForm = React.lazy(() => import('~/views/customers/form'))
const AgentData = React.lazy(() => import('~/views/agents/index'))
const AgentForm = React.lazy(() => import('~/views/agents/form'))
const ShipData = React.lazy(() => import('~/views/ships/index'))
const ShipForm = React.lazy(() => import('~/views/ships/form'))
const PortData = React.lazy(() => import('~/views/ports/index'))
const PortForm = React.lazy(() => import('~/views/ports/form'))
const ContainerData = React.lazy(() => import('~/views/containers/index'))
const ContainerForm = React.lazy(() => import('~/views/containers/form'))
const ContainerTypeData = React.lazy(() => import('~/views/container_types/index'))
const ContainerTypeForm = React.lazy(() => import('~/views/container_types/form'))
const ShipScheduleData = React.lazy(() => import('~/views/ship_schedules/index'))
const ShipScheduleForm = React.lazy(() => import('~/views/ship_schedules/form'))
const PackingListData = React.lazy(() => import('~/views/packing_lists/index'))
const PackingListForm = React.lazy(() => import('~/views/packing_lists/form'))
const ProductData = React.lazy(() => import('~/views/products/index'))
const ProductForm = React.lazy(() => import('~/views/products/form'))
const UserData = React.lazy(() => import('~/views/users/index'))
const UserForm = React.lazy(() => import('~/views/users/form'))
const RoleData = React.lazy(() => import('~/views/roles/index'))
const RoleForm = React.lazy(() => import('~/views/roles/form'))
const LoginForm = React.lazy(() => import('~/views/user_sessions/form'))
const CompanyForm = React.lazy(() => import('~/views/company/form'))
function newLoader(modelName,action = 'create'){
  return async (route)=>{
    const auth = new Auth()
    if(!auth.isAuthorize(snakeCase(modelName),action)){
      throw data('Akses tidak diperbolehkan',{status: 403})
    }
    let record = createModel(modelName,{id: null})
    return {params: route.params, record: record, isViewState: false}
  }
}

function viewLoader(modelName,action= 'read'){
  return async (route)=>{
    const auth = new Auth()
    if(!auth.isAuthorize(snakeCase(modelName),action)){
      throw data('Akses tidak diperbolehkan',{status: 403})
    }
    const formHelper = new FormHelper(auth)
    let record = await formHelper.findRecord(modelName,route.params.id)
    if(!record){
      throw data('data tidak ditemukan',{status: 404})
    }
    return {params: route.params, record: record, isViewState: true}
  }
}

function editLoader(modelName,action = 'update'){
  return async (route)=>{
    const auth = new Auth()
    if(!auth.isAuthorize(snakeCase(modelName),action)){
      throw data('Akses tidak diperbolehkan',{status: 403})
    }
    const formHelper = new FormHelper(auth)
    let record = await formHelper.findRecord(modelName,route.params.id)
    if(!record){
      throw data('data tidak ditemukan',{status: 404})
    }
    return {params: route.params, record: record, isViewState: false}
  }
}

function tableRead(modelName,action='read'){
  return async (route)=>{
    const auth = new Auth()
    if(!auth.isAuthorize(snakeCase(modelName),action)){
      throw data('Akses tidak diperbolehkan',{status: 403})
    }
  }
}

function ErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()
  if (isRouteErrorResponse(error)) {
      return (
        <>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </>
      )


  } else if (error instanceof Error) {
    redirectDocument('/500')
  } else {
    if(error.status === 401){
      redirectDocument('/users/sign_in')
    }else if(error.status == 404){
      redirectDocument('/404')
    }else if(error.status == 403){
      redirectDocument('/403')
    }else if(error.status == 500){
      redirectDocument('/500')
    }
  }
}

function HydrateFallback(){
  return (
    <div className='text-center'>
      <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
    </div>
  )
}

function ForbiddenPage(){
  return(
    <>
    <h3>Tidak ada Akses</h3>
    <p>Hubungi admin anda untuk membuka akses</p>
    <NavLink to='/'>Home</NavLink>
    </>
  )
}

function NotFoundPage(){
  return(
    <>
    <h3>Halaman tidak ditemukan</h3>
    <p>Hubungi admin anda untuk membuka akses</p>
    <NavLink to='/'>Home</NavLink>
    </>
  )
}

function ServerErrorPage(){
  return(
    <>
    <h3>Terjadi Kesalahan di Server</h3>
    <p>Hubungi admin anda untuk memperbaikinya</p>
    <NavLink to='/'>Home</NavLink>
    </>
  )
}

const routerDef = createBrowserRouter( [
  { Component: DefaultLayout,ErrorBoundary: ErrorBoundary,
    children:[
      { index: true, Component: Dashboard, name: 'Home'},
      { path: '/dashboard', name: 'Dashboard',Component: Dashboard , exact: true },
      { path: '/customers',loader: tableRead('Customer'), name: 'Pelanggan', Component: CustomerData, exact: true },
      { path: '/customers/new', loader: newLoader('Customer'), name: 'Buat Pelanggan', Component: CustomerForm, exact: true },
      { path: '/customers/:id', loader: viewLoader('Customer'), name: 'Detail Pelanggan', Component: CustomerForm },
      { path: '/customers/:id/edit',loader: editLoader('Customer'), name: 'Ubah Pelanggan', Component: CustomerForm },
      { path: '/agents',loader: tableRead('Agent'), name: 'Agen', Component: AgentData, exact: true },
      { path: '/agents/new', loader: newLoader('Agent'), name: 'Buat Agen', Component: AgentForm, exact: true },
      { path: '/agents/:id', loader: viewLoader('Agent'), name: 'Detail Agen', Component: AgentForm },
      { path: '/agents/:id/edit',loader: editLoader('Agent'), name: 'Ubah Agen', Component: AgentForm },
      { path: '/ships',loader: tableRead('Ship'), name: 'Kapal', Component: ShipData, exact: true},
      { path: '/ships/new', loader: newLoader('Ship'), name: 'Buat Kapal', Component: ShipForm, exact: true },
      { path: '/ships/:id', loader: viewLoader('Ship'), name: 'Detail Kapal', Component: ShipForm },
      { path: '/ships/:id/edit',loader: editLoader('Ship'), name: 'Ubah Kapal', Component: ShipForm },
      { path: '/ports',loader: tableRead('Port'), name: 'Pelabuhan', Component: PortData, exact: true},
      { path: '/ports/new', loader: newLoader('Port'), name: 'Buat Pelabuhan', Component: PortForm, exact: true },
      { path: '/ports/:id', loader: viewLoader('Port'), name: 'Detail Pelabuhan', Component: PortForm },
      { path: '/ports/:id/edit',loader: editLoader('Port'), name: 'Ubah Pelabuhan', Component: PortForm },
      { path: '/containers',loader: tableRead('Container'), name: 'Kontainer', Component: ContainerData, exact: true,HydrateFallback: HydrateFallback},
      { path: '/containers/new', loader: newLoader('Container'), name: 'Buat Kontainer', Component: ContainerForm, exact: true,HydrateFallback: HydrateFallback },
      { path: '/containers/:id', loader: viewLoader('Container'), name: 'Detail Kontainer', Component: ContainerForm,HydrateFallback: HydrateFallback },
      { path: '/containers/:id/edit',loader: editLoader('Container'), name: 'Ubah Kontainer', Component: ContainerForm,HydrateFallback: HydrateFallback },
      { path: '/products',loader: tableRead('Product'), name: 'Produk', Component: ProductData, exact: true},
      { path: '/products/new', loader: newLoader('Product'), name: 'Buat Produk', Component: ProductForm, exact: true },
      { path: '/products/:id', loader: viewLoader('Product'), name: 'Detail Produk', Component: ProductForm },
      { path: '/products/:id/edit',loader: editLoader('Product'), name: 'Ubah Produk', Component: ProductForm },
      { path: '/packing_lists',loader: tableRead('PackingList'), name: 'Packing List', Component: PackingListData, exact: true},
      { path: '/packing_lists/new', loader: newLoader('PackingList'), name: 'Buat Packing List', Component: PackingListForm, exact: true },
      { path: '/packing_lists/:id', loader: viewLoader('PackingList'), name: 'Detail Packing List', Component: PackingListForm },
      { path: '/packing_lists/:id/edit',loader: editLoader('PackingList'), name: 'Ubah Packing List', Component: PackingListForm },
      { path: '/ship_schedules',loader: tableRead('ShipSchedule'), name: 'Jadwal Kapal', Component: ShipScheduleData, exact: true},
      { path: '/ship_schedules/new', loader: newLoader('ShipSchedule'), name: 'Buat Jadwal Kapal', Component: ShipScheduleForm, exact: true },
      { path: '/ship_schedules/:id', loader: viewLoader('ShipSchedule'), name: 'Detail Jadwal Kapal', Component: ShipScheduleForm },
      { path: '/ship_schedules/:id/edit',loader: editLoader('ShipSchedule'), name: 'Ubah Jadwal Kapal', Component: ShipScheduleForm },
      { path: '/container_types',loader: tableRead('ContainerType'), name: 'Tipe Kontainer', Component: ContainerTypeData, exact: true},
      { path: '/container_types/new', loader: newLoader('ContainerType'), name: 'Buat Tipe Kontainer', Component: ContainerTypeForm, exact: true },
      { path: '/container_types/:id', loader: viewLoader('ContainerType'), name: 'Detail Tipe Kontainer', Component: ContainerTypeForm },
      { path: '/container_types/:id/edit',loader: editLoader('ContainerType'), name: 'Ubah Tipe Kontainer', Component: ContainerTypeForm },
      { path: '/users',loader: tableRead('User'), name: 'User', Component: UserData, exact: true},
      { path: '/users/new', loader: newLoader('User'), name: 'Buat User', Component: UserForm, exact: true },
      { path: '/users/profile', loader: async (route)=>{
          const auth = new Auth({setToken:()=>{}})
          const formHelper = new FormHelper(auth)
          let record = await formHelper.findRecord('User','profile')
          if(!record){
            throw data('data tidak ditemukan',{status: 404})
          }
          return {params: route.params, record: record, isViewState: false}
        }, name: 'Profile', Component: UserForm, exact: true },
      { path: '/users/:id', loader: viewLoader('User'), name: 'Detail User', Component: UserForm },
      { path: '/users/:id/edit',loader: editLoader('User'), name: 'Ubah User', Component: UserForm },
      { path: '/roles', name: 'Jabatan', Component: RoleData, exact: true},
      { path: '/roles/new', loader: newLoader('Role'), name: 'Buat Jabatan', Component: RoleForm, exact: true },
      { path: '/roles/:id', loader: viewLoader('Role'), name: 'Detail Jabatan', Component: RoleForm },
      { path: '/roles/:id/edit',loader: editLoader('Role'), name: 'Ubah Jabatan', Component: RoleForm },
      { path: '/system_settings/company', name: 'Perusahaan', Component: CompanyForm, exact: true},
    ]
  },
  {
    path:'/users/sign_in',
    name: 'Login Page',
    exact: true,
    Component: LoginForm,
  },
  { path: '/403',
    name: 'Not Authorized',
    exact: true,
    Component: ForbiddenPage,
  },
  { path: '/500',
    name: 'Internal Server error',
    exact: true,
    Component: ServerErrorPage,
  },
  { path: '/404',
    name: 'Not Found',
    exact: true,
    Component: NotFoundPage,
  },
  { from: '*',
    to: '/404',
    name: 'redirect to 404 page',
  },
],{})

export default routerDef
