import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import {ShippingContainer,Boat,Lighthouse,User, UserList, Calendar, ArchiveBox, Speedometer, BoxArrowDown, BuildingOffice} from "@phosphor-icons/react"

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <Speedometer className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Master',
  },
  {
    component: CNavItem,
    name: 'Kapal',
    to: '/ships',
    icon: <Boat className='nav-icon'/> ,
  },
  {
    component: CNavItem,
    name: 'Tipe Kontainer',
    to: '/container_types',
    icon: <ShippingContainer className='nav-icon'/>,
  },
  {
    component: CNavItem,
    name: 'Pelabuhan',
    to: '/ports',
    icon: <Lighthouse className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Produk',
    to: '/products',
    icon: <BoxArrowDown className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Client',
    to: '/clients',
    icon: <UserList className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pelanggan / Client',
        to: '/customers',
        icon: <User className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Agen Lorry',
        to: '/agents',
        icon: <User className="nav-icon" />,
      },
    ]
  },
  {
    component: CNavTitle,
    name: 'Order',
  },
  {
    component: CNavItem,
    name: 'Packing List',
    to: '/packing_lists',
    icon: <ArchiveBox className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Kontainer',
    to: '/containers',
    icon: <ShippingContainer className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Jadwal Kapal',
    to: '/ship_schedules',
    icon: <Calendar className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Laporan',
  },
  {
    component: CNavTitle,
    name: 'Pengaturan',
  },
  {
    component: CNavItem,
    name: 'User',
    to: '/users',
    icon: <UserList className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Jabatan',
    to: '/roles',
    icon: <UserList className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Perusahaan',
    to: '/system_settings/company',
    icon: <BuildingOffice className="nav-icon" />,
  },
]

export default _nav
