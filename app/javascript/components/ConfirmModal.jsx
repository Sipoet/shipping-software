import React from "react"
import {CButton,CModal,CModalBody,CModalHeader,CModalTitle,CModalFooter} from '@coreui/react'
function ConfirmModal(props){
  props.ref.current = {openModal:openModal,closeModal:closeModal}
  const [visibleConfirmation, setVisibleConfirmation] = React.useState(false)
  const [_title,setTitle] = React.useState(props.title)
  const [_description,setDescription] = React.useState(props.description)
  const [_resolving,setResolving] = React.useState(props.resolving)
  const [_submitLabel,setSubmitLabel] = React.useState(props.submitLabel)
  const [_submitColor,setSubmitColor] = React.useState(props.submitColor)
  function openModal({title,description,resolving,submitLabel='Ya',submitColor= 'info'}){
    setDescription(description)
    setTitle(title)
    setResolving((old)=> resolving)
    setVisibleConfirmation(true)
    setSubmitLabel(submitLabel)
    setSubmitColor(submitColor)
  }

  function closeModal(result){
    setVisibleConfirmation(false)
    _resolving(result)
  }

  // React.useEffect(()=>{
  //   props.ref =ref
  // },[])

  return(
    <CModal
      visible={visibleConfirmation}
      onClose={() => setVisibleConfirmation(false)}
      aria-labelledby="deleteConfirmation"
    >
      <CModalHeader>
        <CModalTitle id="deleteConfirmation">{_title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{_description}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => closeModal(false)}>
          Batal
        </CButton>
        <CButton color={_submitColor} onClick={() => closeModal(true)}>{_submitLabel ||'Ya'}</CButton>
      </CModalFooter>
    </CModal>

  )
}

export default ConfirmModal