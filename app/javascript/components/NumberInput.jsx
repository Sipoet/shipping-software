import React from 'react'
import { CCol,CFormInput,CInputGroup,CInputGroupText,CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { IMaskMixin } from 'react-imask'
import {moneyFormat} from '~/lib/text_formatter'
// import IMask from 'imask';

const CFormInputWithMask =  IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput
    {...props}
    ref={inputRef} // bind internal input
  />
))
function NumberInput({onChange,...props}){
  return(
    <CFormInputWithMask
      {...props}
      mask={Number}
      scale="5"
      type="text"
      onAccept={onChange}
      thousandsSeparator=','
      normalizeZeros={true}
      radix='.'
      mapToRadix= {['.']}
      autofix={true} />
  )
}

function MoneyInput({onChange,label,...props}){

  if(props.plainText && props.readOnly){
    console.log(label)
    return (<>
        <CRow>
          <CFormLabel hidden={label == null} htmlFor={props.id} className="col-sm-3 col-form-label">{label}:</CFormLabel>
          <CCol sm={9} className='pt-2'>
            {moneyFormat(props.value || props.defaultValue)}
          </CCol>
        </CRow>
    </>)
  }
  else{
    return(
    <>
      <CFormLabel hidden={label == null} htmlFor={props.id}>{label}</CFormLabel>
      <CInputGroup className="mb-3">
        <CInputGroupText id="money-addon">Rp.</CInputGroupText>
        <CFormInputWithMask
          {...props}
          mask={Number}
          scale="2"
          onAccept={onChange}
          thousandsSeparator=','
          normalizeZeros={true}
          mapToRadix= {['.']}
          aria-describedby="money-addon"
          radix='.'
          autofix={true} />
      </CInputGroup>
    </>
  )
  }

}

const weightOptions= [
  {label: 'Kg',value: 'kg'},
  {label: 'Ton',value: 'ton'},
  {label: 'Gram',value: 'gr'},
  {label: 'Mg',value: 'mg'},
]
const lengthOptions =[
  {label: 'Meter',value: 'm'},
  {label: 'Km',value: 'km'},
  {label: 'Cm',value: 'cm'},
  {label: 'Mm',value: 'mm'},
]
const dimensionOptions =[
  {label: (<>M&sup3;</>),value: 'm3'},
  {label: (<>Cm&sup3;</>),value: 'cm3'},
  {label: 'KL',value: 'kl'},
  {label: 'Liter',value: 'ltr'},
  {label: 'ML',value: 'ml'},
]

function UnitInput({label,groupMeasurement,uom,measurementName,onChange,onMeasurementChange,...props}){

  function optionsOf(key){
    switch (key) {
      case 'weight':
        return weightOptions
      case 'length':
        return lengthOptions
      case 'dimension':
        return dimensionOptions
      default:
        return dimensionOptions
    }
  }

  return(
    <>
      <CFormLabel hidden={label == null} htmlFor="basic-url">{label}</CFormLabel>
      <CInputGroup className="mb-3">
        <CFormInputWithMask
          {...props}
          mask={Number}
          scale="2"
          onAccept={onChange}
          thousandsSeparator=','
          normalizeZeros={true}
          mapToRadix= {['.']}
          aria-describedby="money-addon"
          radix='.' autofix={true} />
        <CFormSelect readOnly={props.readOnly} className='uom-select' disabled={props.disabled} options={optionsOf(groupMeasurement)} name={measurementName} onChange={onMeasurementChange} defaultValue={uom} placeholder='Satuan...'></CFormSelect>
      </CInputGroup>
    </>
  )
}

function PhoneInput({onChange,...props}){
  return(<CFormInputWithMask onAccept={onChange} {...props} mask="+{62} 00 000 0000 0000" placeholder="+{62} 00 000 0000 0000"/>)
}

export {NumberInput, PhoneInput, MoneyInput, UnitInput, CFormInputWithMask}