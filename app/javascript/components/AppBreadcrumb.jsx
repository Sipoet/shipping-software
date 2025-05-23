import React from 'react'
import {  Link, useLocation } from 'react-router'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname) => {
    let names = pathname.split('/')
    return names[names.length - 1]
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem ><Link to={'/'}>Home</Link></CBreadcrumbItem>

      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...( { active: breadcrumb.active })}
            key={index}
          >
            {breadcrumb.active ? breadcrumb.name : <Link to={breadcrumb.pathname}>{breadcrumb.name}</Link>}

          </CBreadcrumbItem>

        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
