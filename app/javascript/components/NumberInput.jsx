import React from 'react'
import { CFormInput,CInputGroup,CInputGroupText,CFormLabel, CFormSelect } from '@coreui/react'
import { IMaskMixin } from 'react-imask'
// import IMask from 'imask';
const CFormInputWithMask =  IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput
    {...props}
    ref={inputRef} // bind internal input
  />
))
function NumberInput({...props}){
  return(
    <CFormInputWithMask
      {...props}
      mask={Number}
      scale="5"
      thousandsSeparator=','
      normalizeZeros={true}
      radix='.'
      mapToRadix= {['.']}
      autofix={true} />
  )
}

function MoneyInput({label,...props}){
  return(
    <>
      <CFormLabel htmlFor="basic-url">{label}</CFormLabel>
      <CInputGroup className="mb-3">
        <CInputGroupText id="money-addon">Rp.</CInputGroupText>
        <CFormInputWithMask
          {...props}
          mask={Number}
          scale="2"
          thousandsSeparator=','
          normalizeZeros={true}
          mapToRadix= {['.']}
          aria-describedby="money-addon"
          radix='.' autofix={true} />
      </CInputGroup>
    </>
  )
}

function UnitInput({label,groupMeasurement,uom,measurementName,onMeasurementChange,...props}){
  const weightOptions= [
    {label: 'Ton',value: 'ton'},
    {label: 'Kg',value: 'kg',default: true},
    {label: 'Gram',value: 'gr'},
    {label: 'Mg',value: 'mg'},
  ]
  const lengthOptions =[
    {label: 'Km',value: 'km'},
    {label: 'Meter',value: 'm',default: true},
    {label: 'Cm',value: 'cm'},
    {label: 'Mm',value: 'mm'},
  ]
  const dimensionOptions =[
    {label: 'Kl',value: 'kl'},
    {label: 'Liter',value: 'ltr',default: true},
    {label: 'Ml',value: 'ml'},
  ]
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
      <CFormLabel htmlFor="basic-url">{label}</CFormLabel>
      <CInputGroup className="mb-3">
        <CFormInputWithMask
          {...props}
          mask={Number}
          scale="2"
          thousandsSeparator=','
          normalizeZeros={true}
          mapToRadix= {['.']}
          aria-describedby="money-addon"
          radix='.' autofix={true} />
        <CFormSelect options={optionsOf(groupMeasurement)} name={measurementName} onChange={onMeasurementChange} defaultValue={uom} placeholder='Satuan...'></CFormSelect>
      </CInputGroup>
    </>
  )
}

function PhoneInput({...props}){
  return(<CFormInputWithMask {...props} mask="+{62} 00 000 0000 0000" placeholder="+{62} 00 000 0000 0000"/>)
}

export {NumberInput, PhoneInput, MoneyInput, UnitInput, CFormInputWithMask}