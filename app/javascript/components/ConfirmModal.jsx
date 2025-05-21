import React from "react"
import {CButton,CModal,CModalBody,CModalHeader,CModalTitle,CModalFooter} from '@coreui/react'
function ConfirmModal(props){
  props.ref.current = {openModal:openModal,closeModal:closeModal}
  const [visibleConfirmation, setVisibleConfirmation] = React.useState(false)

  function openModal(){
    setVisibleConfirmation(true)
  }

  function closeModal(result){
    setVisibleConfirmation(false)
    props.resolving(result)
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
        <CModalTitle id="deleteConfirmation">{props.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{props.description}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => closeModal(false)}>
          Batal
        </CButton>
        <CButton color="danger" onClick={() => closeModal(true)}>{props.submitLabel ||'Ya'}</CButton>
      </CModalFooter>
    </CModal>

  )
}

export default ConfirmModal