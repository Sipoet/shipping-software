import {CAlert, CCol,CForm,CButton,CModal,CModalBody,CCard,CCardHeader,CCardBody,CCardFooter,CModalHeader,CModalTitle,CModalFooter,CFormInput,CToast, CToastBody, CToaster, CToastHeader, CRow, CFormCheck, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody } from '@coreui/react'
import React  from 'react'
import { FormHelper } from '~/lib/form_helper'
import { useNavigate , useLoaderData, useOutletContext } from 'react-router'
import { Eye, Pencil } from '@phosphor-icons/react'
import { AuthContext } from '~/lib/context'
import { createModel } from '~/lib/model'
import  {cloneDeep}  from 'lodash'
import RecordActions from '~/components/RecordActions'

const RoleForm = () => {
  const params = useLoaderData()
  const [record,setRecord] = React.useState(params.record)
  const [visible, setVisible] = React.useState(false)
  const [visibleConfirmationDelete, setVisibleConfirmationDelete] = React.useState(false)
  const [viewState, setViewState] = React.useState(params.isViewState)
  const [status, setStatus] = React.useState('info')
  const [message, setMessage] = React.useState('')
  const [toast, setToast] = React.useState()
  const [resources, setResources] = React.useState([])
  const [error, setError] = React.useState({})
  const toaster = React.useRef(null)
  const [progressBar,setProgressBar,progressColor,setProgressColor] = useOutletContext()
  const progressOptions ={progressBar,setProgressBar,progressColor,setProgressColor,showProgress: true}
  const navigate = useNavigate()
  const [auth,setAuth] = React.useContext(AuthContext)
  const formHelper = new FormHelper(auth)

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false || progressBar > 0) {
      return;
    }
    record.role_auths_attributes= convertAuthAttributes(record.role_auths)
    delete record.role_auths
    let isNewRecord = record.isNewRecord
    formHelper.saveRecord(record,progressOptions).then((result)=>{
      if(result.isSuccess && isNewRecord){
        setError({})
        navigate(`/roles/${record.id}/edit`, {replace: true})
      }
      if(result.isSuccess){
        setRecord(result.record)
        showSuccessNotif(result.message)
        setError({})
      }else{
        setError(result.error)
        showErrorNotif(result.message)
      }
    })
  }

  function convertAuthAttributes(rawRoleAuths){
    let roleAuths = {}
    rawRoleAuths.forEach(line => {
      roleAuths[line.auth_controller] ||={}
      roleAuths[line.auth_controller][line.auth_action] = line
    });
    let newRawRoleAuths = []
    for(const resource of resources){
      let line = roleAuths[resource.resource]?.['all']
      if(resource.selected === true){
        if(line == null){
          newRawRoleAuths.push({auth_controller: resource.resource,auth_action: 'all'})
        }else{
          line._destroy = false
          newRawRoleAuths.push(line)
        }
        continue
      }else{
        if(line != null){
          line._destroy = true
          newRawRoleAuths.push(line)
        }
      }
      for(const action of resource.actions){
        let line = roleAuths[resource.resource]?.[action.name]

        if(action.selected === true){
          if(line == null){
            newRawRoleAuths.push({auth_controller: resource.resource,auth_action: action.name})
          }else{
            line._destroy = false
            newRawRoleAuths.push(line)
          }

          if(action.required != null){
            for(const requiredAction of action.required){
              let subline = roleAuths[requiredAction.resource]?.[requiredAction.name]
              let sublineAll = roleAuths[requiredAction.resource]?.['all']
              if(subline == null && sublineAll == null){
                newRawRoleAuths.push({auth_controller: resource.resource,auth_action: action.name})
              }
              else if(subline != null){
                subline._destroy = false
                newRawRoleAuths.push(line)
              }
            }
          }
        }else{
          if(line != null){
            line._destroy = true
            newRawRoleAuths.push(line)
          }
        }
      }

    }
    return newRawRoleAuths
  }

  function showSuccessNotif(message){
    setToast(
    (<CToast color='success' key={'toast-form'}>
      <CToastHeader closeButton>
        <div className="fw-bold me-auto">Sukses</div>
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>)
    )
  }

  function showErrorNotif(message){
    setStatus('danger')
    setMessage(message)
    setVisible(true)
  }

  async function getAuthorizationList(){
    const response = await auth.request('/roles/list_authorizations.json')
    if(response.status === 200){
      const result = await response.json()
      setResources(e => convertRoleAuth(result,record.role_auths))
    }else if(response.status == 500){
      const requestError = await response.text()
      console.error(requestError)
    }else{
      const result = await response.json()
      console.error(result)
    }
  }

  function convertRoleAuth(res,rawRoleAuths){
    let roleAuths = {}
    rawRoleAuths.forEach(line => {
      roleAuths[line.auth_controller] ||={}
      roleAuths[line.auth_controller][line.auth_action] = true
    });
    for(let resource of res){
      resource.selected = roleAuths[resource.resource]?.['all']
      for(let action of resource.actions){
        action.selected = roleAuths[resource.resource]?.['all'] || roleAuths[resource.resource]?.[action.name]
      }
    }
    return res
  }

  React.useEffect(() =>  {
    setViewState(params.isViewState)
    setRecord(params.record)

    setResources(e => convertRoleAuth(resources,params.record.role_auths))
    if(resources.length === 0){
      getAuthorizationList()
    }
  }, [params.isViewState])

  function changeRecord(event){
    const targetName = event.currentTarget.name
    record[targetName] = event.currentTarget.value
    const newRecord = createModel(record._modelName,record.attributes)
    setRecord(newRecord)
  }

  function confirmDelete(){
    formHelper.deleteRecord(record).then((result)=>{
      if(result === true){
        setVisibleConfirmationDelete(false)
        setToast(
          (<CToast color='success' key={'toast-form'}>
            <CToastHeader closeButton>
              <div className="fw-bold me-auto">Sukses</div>
            </CToastHeader>
            <CToastBody>Sukses hapus</CToastBody>
          </CToast>))
        navigate('roles')
      }
    })
  }


  function toggleNavigate(){
    if(viewState){
      navigate(`/roles/${record.id}/edit` )
    }else{
      navigate(`/roles/${record.id}`)
    }
  }


  function resourceActionChange(resource,action=null){
    if(action === null){
      return (event)=>{
        const value = event.currentTarget.checked
        resource.selected = value
        resource.actions.forEach(action=> action.selected = value)
        const index = parseInt(event.currentTarget.getAttribute('itemKey'))
        resources[index] = resource
        setResources(res => cloneDeep(resources))
      }
    }else{
      return (event)=>{
        const value = event.currentTarget.checked
        action.selected = value
        if(!value){
          resource.selected = false
        }
        const index = parseInt(event.currentTarget.getAttribute('itemKey'))
        resources[index] = resource
        setResources(res => cloneDeep(resources))
      }
    }
  }

  const recordActions = [
    {
      label: (<>Tambah <Plus /></>),
      props:{
        color: 'primary',
        variant: 'outline',
        onClick: () => navigate('/products/new'),
        hidden: !auth.isAuthorize('product','create') || record.isNewRecord || !viewState,
      }
    },
    {
      label: (<>Edit <Pencil /></>),
      props:{
        color: 'info',
        onClick: toggleNavigate,
        hidden: !auth.isAuthorize('product','update') || record.isNewRecord || !viewState,
      }
    },
    {
      label: (<>Lihat <Eye /></>),
      props:{
        color: 'secondary',
        onClick: toggleNavigate,
        hidden: !auth.isAuthorize('product','read') || record.isNewRecord || viewState,
      }
    },
  ]

  return (
    <>
      <CModal
        visible={visibleConfirmationDelete}
        onClose={() => setVisibleConfirmationDelete(false)}
        aria-labelledby="deleteConfirmation"
      >
        <CModalHeader>
          <CModalTitle id="deleteConfirmation">Konfirmasi Hapus</CModalTitle>
        </CModalHeader>
        <CModalBody>Apakah Yakin Hapus Jabatan {record.name} ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleConfirmationDelete(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>Hapus</CButton>
        </CModalFooter>
      </CModal>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />

      <CCard>
        <CCardHeader>Form Jabatan
          <RecordActions record={record} className='float-end' actions={recordActions} />
        </CCardHeader>
        <CForm
            className="row g-3 needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
          <CCardBody>
            <CAlert color={status} dismissible visible={visible} onClose={() => setVisible(false)}>
              {message}
            </CAlert>
            <CCol md={4} className='mb-4'>
              <CFormInput readOnly={viewState} type="text" id="role-name" label='Nama Jabatan' invalid={error.name != null}  feedback={error.name} name='name' onChange={changeRecord} value={record.name} />
            </CCol>
            <h4>Otorisasi</h4>
            <CAccordion activeItemKey={0}>
              {resources.map(resource => (
                <CAccordionItem key={resource.resource} itemKey={resources.indexOf(resource)}>
                  <CAccordionHeader>{resource.label}</CAccordionHeader>
                  <CAccordionBody>
                    <CRow>
                      <CCol key={`${resource.resource}-all`} md={3}>
                        <CFormCheck label='Semua' name='all' itemKey={resources.indexOf(resource)} onChange={resourceActionChange(resource)} checked={resource.selected} />
                      </CCol>
                      {
                        resource.actions.map(action =>(
                          <CCol key={`${resource.resource}-${action.name}`} md={3}>
                            <CFormCheck readOnly={viewState} label={action.label} itemKey={resources.indexOf(resource)} name={action.name} onChange={resourceActionChange(resource,action)} checked={action.selected} />
                          </CCol>
                        ))
                      }
                    </CRow>
                  </CAccordionBody>
                </CAccordionItem>
              ))}
            </CAccordion>

          </CCardBody>
          <CCardFooter hidden={viewState}>
            <CButton color="primary" type="submit">
              Simpan
            </CButton>
          </CCardFooter>
        </CForm>
      </CCard>



    </>
  )
}

export default RoleForm
