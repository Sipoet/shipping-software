import React from 'react'
import { createBrowserRouter,data,isRouteErrorResponse,useNavigate,useRouteError } from 'react-router'
import DefaultLayout from './views/layouts/default_layout'
import { FormHelper } from '~/lib/form_helper'
import { createModel } from '~/lib/model'
import {Auth} from '~/lib/auth'
import { CSpinner } from '@coreui/react'

const Dashboard = React.lazy(() => import('./views/home/Dashboard'))
const CustomerData = React.lazy(() => import('./views/customers/index'))
const CustomerForm = React.lazy(() => import('./views/customers/form'))
const SupplierData = React.lazy(() => import('./views/suppliers/index'))
const SupplierForm = React.lazy(() => import('./views/suppliers/form'))
const AgentData = React.lazy(() => import('./views/agents/index'))
const AgentForm = React.lazy(() => import('./views/agents/form'))
const ShipData = React.lazy(() => import('./views/ships/index'))
const ShipForm = React.lazy(() => import('./views/ships/form'))
const PortData = React.lazy(() => import('./views/ports/index'))
const PortForm = React.lazy(() => import('./views/ports/form'))
const ContainerData = React.lazy(() => import('./views/containers/index'))
const ContainerForm = React.lazy(() => import('./views/containers/form'))
const ContainerTypeData = React.lazy(() => import('./views/container_types/index'))
const ContainerTypeForm = React.lazy(() => import('./views/container_types/form'))
const ShipScheduleData = React.lazy(() => import('./views/ship_schedules/index'))
const ShipScheduleForm = React.lazy(() => import('./views/ship_schedules/form'))
const PackingListData = React.lazy(() => import('./views/packing_lists/index'))
const PackingListForm = React.lazy(() => import('./views/packing_lists/form'))
const ProductData = React.lazy(() => import('./views/products/index'))
const ProductForm = React.lazy(() => import('./views/products/form'))
const UserData = React.lazy(() => import('./views/users/index'))
const UserForm = React.lazy(() => import('./views/users/form'))
const RoleData = React.lazy(() => import('./views/roles/index'))
const RoleForm = React.lazy(() => import('./views/roles/form'))
const LoginForm = React.lazy(() => import('./views/user_sessions/form'))

function newLoader(modelName){
  return async (route)=>{
    let record = createModel(modelName,{id: null})
    return {params: route.params, record: record, isViewState: false}
  }
}

function viewLoader(modelName){
  return async (route)=>{
    const auth = new Auth({setToken:()=>{}})
    const formHelper = new FormHelper(auth)
    let record = await formHelper.findRecord(modelName,route.params.id)
    if(!record){
      throw data('data tidak ditemukan',{status: 404})
    }
    return {params: route.params, record: record, isViewState: true}
  }
}

function editLoader(modelName){
  return async (route)=>{
    const auth = new Auth({setToken:()=>{}})
    const formHelper = new FormHelper(auth)
    let record = await formHelper.findRecord(modelName,route.params.id)
    if(!record){
      throw data('data tidak ditemukan',{status: 404})
    }
    return {params: route.params, record: record, isViewState: false}
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
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    if(error.status === 401){
      React.useEffect(()=>{
        navigate('/users/sign_in')
      },[])

    }else{

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

const routerDef = createBrowserRouter( [
  { Component: DefaultLayout,ErrorBoundary: ErrorBoundary,
    children:[
      { index: true, Component: Dashboard, name: 'Home'},
      { path: '/dashboard', name: 'Dashboard',Component: Dashboard , exact: true },
      { path: '/customers', name: 'Pelanggan', Component: CustomerData, exact: true },
      { path: '/customers/new', loader: newLoader('Customer'), name: 'Buat Pelanggan', Component: CustomerForm, exact: true },
      { path: '/customers/:id', loader: viewLoader('Customer'), name: 'Detail Pelanggan', Component: CustomerForm },
      { path: '/customers/:id/edit',loader: editLoader('Customer'), name: 'Ubah Pelanggan', Component: CustomerForm },
      { path: '/suppliers', name: 'Supplier', Component: SupplierData, exact: true },
      { path: '/suppliers/new', loader: newLoader('Supplier'), name: 'Buat Supplier', Component: SupplierForm, exact: true },
      { path: '/suppliers/:id', loader: viewLoader('Supplier'), name: 'Detail Supplier', Component: SupplierForm },
      { path: '/suppliers/:id/edit',loader: editLoader('Supplier'), name: 'Ubah Supplier', Component: SupplierForm },
      { path: '/agents', name: 'Agen', Component: AgentData, exact: true },
      { path: '/agents/new', loader: newLoader('Agent'), name: 'Buat Agen', Component: AgentForm, exact: true },
      { path: '/agents/:id', loader: viewLoader('Agent'), name: 'Detail Agen', Component: AgentForm },
      { path: '/agents/:id/edit',loader: editLoader('Agent'), name: 'Ubah Agen', Component: AgentForm },
      { path: '/ships', name: 'Kapal', Component: ShipData, exact: true},
      { path: '/ships/new', loader: newLoader('Ship'), name: 'Buat Kapal', Component: ShipForm, exact: true },
      { path: '/ships/:id', loader: viewLoader('Ship'), name: 'Detail Kapal', Component: ShipForm },
      { path: '/ships/:id/edit',loader: editLoader('Ship'), name: 'Ubah Kapal', Component: ShipForm },
      { path: '/ports', name: 'Pelabuhan', Component: PortData, exact: true},
      { path: '/ports/new', loader: newLoader('Port'), name: 'Buat Pelabuhan', Component: PortForm, exact: true },
      { path: '/ports/:id', loader: viewLoader('Port'), name: 'Detail Pelabuhan', Component: PortForm },
      { path: '/ports/:id/edit',loader: editLoader('Port'), name: 'Ubah Pelabuhan', Component: PortForm },
      { path: '/containers', name: 'Kontainer', Component: ContainerData, exact: true,HydrateFallback: HydrateFallback},
      { path: '/containers/new', loader: newLoader('Container'), name: 'Buat Kontainer', Component: ContainerForm, exact: true,HydrateFallback: HydrateFallback },
      { path: '/containers/:id', loader: viewLoader('Container'), name: 'Detail Kontainer', Component: ContainerForm,HydrateFallback: HydrateFallback },
      { path: '/containers/:id/edit',loader: editLoader('Container'), name: 'Ubah Kontainer', Component: ContainerForm,HydrateFallback: HydrateFallback },
      { path: '/products', name: 'Produk', Component: ProductData, exact: true},
      { path: '/products/new', loader: newLoader('Product'), name: 'Buat Produk', Component: ProductForm, exact: true },
      { path: '/products/:id', loader: viewLoader('Product'), name: 'Detail Produk', Component: ProductForm },
      { path: '/products/:id/edit',loader: editLoader('Product'), name: 'Ubah Produk', Component: ProductForm },
      { path: '/packing_lists', name: 'Packing List', Component: PackingListData, exact: true},
      { path: '/packing_lists/new', loader: newLoader('PackingList'), name: 'Buat Packing List', Component: PackingListForm, exact: true },
      { path: '/packing_lists/:id', loader: viewLoader('PackingList'), name: 'Detail Packing List', Component: PackingListForm },
      { path: '/packing_lists/:id/edit',loader: editLoader('PackingList'), name: 'Ubah Packing List', Component: PackingListForm },
      { path: '/ship_schedules', name: 'Jadwal Kapal', Component: ShipScheduleData, exact: true},
      { path: '/ship_schedules/new', loader: newLoader('ShipSchedule'), name: 'Buat Jadwal Kapal', Component: ShipScheduleForm, exact: true },
      { path: '/ship_schedules/:id', loader: viewLoader('ShipSchedule'), name: 'Detail Jadwal Kapal', Component: ShipScheduleForm },
      { path: '/ship_schedules/:id/edit',loader: editLoader('ShipSchedule'), name: 'Ubah Jadwal Kapal', Component: ShipScheduleForm },
      { path: '/container_types', name: 'Tipe Kontainer', Component: ContainerTypeData, exact: true},
      { path: '/container_types/new', loader: newLoader('ContainerType'), name: 'Buat Tipe Kontainer', Component: ContainerTypeForm, exact: true },
      { path: '/container_types/:id', loader: viewLoader('ContainerType'), name: 'Detail Tipe Kontainer', Component: ContainerTypeForm },
      { path: '/container_types/:id/edit',loader: editLoader('ContainerType'), name: 'Ubah Tipe Kontainer', Component: ContainerTypeForm },
      { path: '/users', name: 'User', Component: UserData, exact: true},
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
    ]
  },
  {
    path:'/users/sign_in',
    name: 'Login Page',
    exact: true,
    Component: LoginForm,
  }
],{})

export default routerDef
