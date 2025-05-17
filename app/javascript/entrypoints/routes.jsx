import React from 'react'
import { createHashRouter } from 'react-router'
import DefaultLayout from './views/layouts/default_layout'
import { findRecord } from './lib/form_helper'
import { createModel } from './lib/model'

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


function newLoader(modelName){
  return async (route)=>{
    let params =route.params
    let record = await createModel(modelName,params.id)
    return {params: params, record: record,isViewState: false}
  }
}

function viewLoader(modelName){
  return async (route)=>{
    let params =route.params
    let record = await findRecord(modelName,params.id)
    return {params: params, record: record, isViewState: true}
  }
}

function editLoader(modelName){
  return async (route)=>{
    let params =route.params
    let record = await findRecord(modelName,params.id)
    return {params: params, record: record, isViewState: false}
  }
}

const routerDef = createHashRouter( [
  { Component: DefaultLayout,
    children:[
      { index: true, Component: Dashboard, name: 'Home' },
      { path: 'dashboard', name: 'Dashboard',Component: Dashboard , exact: true },
      { path: 'customers', name: 'Pelanggan', Component: CustomerData, exact: true },
      { path: 'customers/new', loader: newLoader('Customer'), name: 'Buat Pelanggan', Component: CustomerForm, exact: true },
      { path: 'customers/:id', loader: viewLoader('Customer'), name: 'Detail Pelanggan', Component: CustomerForm },
      { path: 'customers/:id/edit',loader: editLoader('Customer'), name: 'Ubah Pelanggan', Component: CustomerForm },
      { path: 'suppliers', name: 'Supplier', Component: SupplierData, exact: true },
      { path: 'suppliers/new', loader: newLoader('Supplier'), name: 'Buat Supplier', Component: SupplierForm, exact: true },
      { path: 'suppliers/:id', loader: viewLoader('Supplier'), name: 'Detail Supplier', Component: SupplierForm },
      { path: 'suppliers/:id/edit',loader: editLoader('Supplier'), name: 'Ubah Supplier', Component: SupplierForm },
      { path: 'agents', name: 'Agen', Component: AgentData, exact: true },
      { path: 'agents/new', loader: newLoader('Agent'), name: 'Buat Agen', Component: AgentForm, exact: true },
      { path: 'agents/:id', loader: viewLoader('Agent'), name: 'Detail Agen', Component: AgentForm },
      { path: 'agents/:id/edit',loader: editLoader('Agent'), name: 'Ubah Agen', Component: AgentForm },
      { path: 'ships', name: 'Kapal', Component: ShipData, exact: true},
      { path: 'ships/new', loader: newLoader('Ship'), name: 'Buat Kapal', Component: ShipForm, exact: true },
      { path: 'ships/:id', loader: viewLoader('Ship'), name: 'Detail Kapal', Component: ShipForm },
      { path: 'ships/:id/edit',loader: editLoader('Ship'), name: 'Ubah Kapal', Component: ShipForm },
      { path: 'ports', name: 'Pelabuhan', Component: PortData, exact: true},
      { path: 'ports/new', loader: newLoader('Port'), name: 'Buat Pelabuhan', Component: PortForm, exact: true },
      { path: 'ports/:id', loader: viewLoader('Port'), name: 'Detail Pelabuhan', Component: PortForm },
      { path: 'ports/:id/edit',loader: editLoader('Port'), name: 'Ubah Pelabuhan', Component: PortForm },
      { path: 'containers', name: 'Kontainer', Component: ContainerData, exact: true},
      { path: 'containers/new', loader: newLoader('Container'), name: 'Buat Kontainer', Component: ContainerForm, exact: true },
      { path: 'containers/:id', loader: viewLoader('Container'), name: 'Detail Kontainer', Component: ContainerForm },
      { path: 'containers/:id/edit',loader: editLoader('Container'), name: 'Ubah Kontainer', Component: ContainerForm },
      { path: 'products', name: 'Produk', Component: ProductData, exact: true},
      { path: 'products/new', loader: newLoader('Product'), name: 'Buat Produk', Component: ProductForm, exact: true },
      { path: 'products/:id', loader: viewLoader('Product'), name: 'Detail Produk', Component: ProductForm },
      { path: 'products/:id/edit',loader: editLoader('Product'), name: 'Ubah Produk', Component: ProductForm },
      { path: 'packing_lists', name: 'Packing List', Component: PackingListData, exact: true},
      { path: 'packing_lists/new', loader: newLoader('PackingList'), name: 'Buat Packing List', Component: PackingListForm, exact: true },
      { path: 'packing_lists/:id', loader: viewLoader('PackingList'), name: 'Detail Packing List', Component: PackingListForm },
      { path: 'packing_lists/:id/edit',loader: editLoader('PackingList'), name: 'Ubah Packing List', Component: PackingListForm },
      { path: 'ship_schedules', name: 'Jadwal Kapal', Component: ShipScheduleData, exact: true},
      { path: 'ship_schedules/new', loader: newLoader('ShipSchedule'), name: 'Buat Jadwal Kapal', Component: ShipScheduleForm, exact: true },
      { path: 'ship_schedules/:id', loader: viewLoader('ShipSchedule'), name: 'Detail Jadwal Kapal', Component: ShipScheduleForm },
      { path: 'ship_schedules/:id/edit',loader: editLoader('ShipSchedule'), name: 'Ubah Jadwal Kapal', Component: ShipScheduleForm },
      { path: 'container_types', name: 'Tipe Kontainer', Component: ContainerTypeData, exact: true},
      { path: 'container_types/new', loader: newLoader('ContainerType'), name: 'Buat Tipe Kontainer', Component: ContainerTypeForm, exact: true },
      { path: 'container_types/:id', loader: viewLoader('ContainerType'), name: 'Detail Tipe Kontainer', Component: ContainerTypeForm },
      { path: 'container_types/:id/edit',loader: editLoader('ContainerType'), name: 'Ubah Tipe Kontainer', Component: ContainerTypeForm },
    ]
  }
])

export default routerDef
