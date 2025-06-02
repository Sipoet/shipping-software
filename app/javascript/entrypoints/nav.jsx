import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import {ShippingContainer,Boat,Lighthouse,User, UserList, Calendar, ArchiveBox, Speedometer, BoxArrowDown, BuildingOffice} from "@phosphor-icons/react"

const _nav = (auth) => [
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
    hidden: !auth.isAuthorize('ship','read'),
    icon: <Boat className='nav-icon'/> ,
  },
  {
    component: CNavItem,
    name: 'Tipe Kontainer',
    to: '/container_types',
    hidden: !auth.isAuthorize('container_type','read'),
    icon: <ShippingContainer className='nav-icon'/>,
  },
  {
    component: CNavItem,
    name: 'Pelabuhan',
    to: '/ports',
    hidden: !auth.isAuthorize('port','read'),
    icon: <Lighthouse className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Produk',
    to: '/products',
    hidden: !auth.isAuthorize('product','read'),
    icon: <BoxArrowDown className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Client',
    to: '/clients',
    hidden: !auth.isAuthorize('customer','read') && !auth.isAuthorize('agent','read'),
    icon: <UserList className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pelanggan / Client',
        to: '/customers',
        hidden: !auth.isAuthorize('customer','read'),
        icon: <User className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Agen Lorry',
        to: '/agents',
        hidden: !auth.isAuthorize('agent','read'),
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
    hidden: !auth.isAuthorize('packing_list','read'),
    icon: <ArchiveBox className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Kontainer',
    to: '/containers',
    hidden: !auth.isAuthorize('container','read'),
    icon: <ShippingContainer className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Jadwal Kapal',
    to: '/ship_schedules',
    hidden: !auth.isAuthorize('ship_schedule','read'),
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
    hidden: !auth.isAuthorize('user','read'),
    icon: <UserList className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Jabatan',
    to: '/roles',
    hidden: !auth.isAuthorize('role','read'),
    icon: <UserList className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Perusahaan',
    to: '/system_settings/company',
    hidden: !auth.isAuthorize('company','read'),
    icon: <BuildingOffice className="nav-icon" />,
  },
]

export default _nav
