import { CCol, CRow } from "@coreui/react"
import React from "react"
import {DateTime} from 'luxon'
import {dateFormat,numberToWord,phoneFormat, DEFAULT_DATE_FORMAT} from '~/lib/text_formatter'
import { CompanyContext } from "~/lib/context"
function CompanyHeader({company}){
  return(
    <CRow>
      <CCol lg={2}>
        <img href='/company_image?type=icon' alt="icon company" className="company-image small"/>
      </CCol>
      <CCol lg={10}>
        <h1>{company.name}</h1>
        <p>{company.address}<br/>
        {company.contact_numbers.map(cn=> `${cn.contact_type}:${phoneFormat(cn.value)}`).join('/')}<br/>
        {company.city}</p>
      </CCol>
    </CRow>
  )
}

function CompanyFooter({company}){
  return(
    <>
    <div>Transfer via:</div>
    <div>A/N {company.account_register_name}</div>
    <div>Transfer via: {company.bank} - {company.bank_account}</div>
    <div>{company.city}</div>
    </>

  )
}

const InvoicePrint = React.forwardRef((props, ref)=>{
  const {record} = props
  const canvasEl = React.useRef(null);
  const today = DateTime.now().toFormat(DEFAULT_DATE_FORMAT)
  const [company,setCompany] = React.useContext(CompanyContext)
  return(
  <div className="print-only a5-landscape" ref={ref}>
    <CRow>
      <CCol lg={8}><CompanyHeader company={company}></CompanyHeader></CCol>
      <CCol lg={4} className="align-self-end">
        <h3 className="text-center">Kwitansi</h3>
        <p>No: {record.code}</p>
      </CCol>
    </CRow>
    <hr />
    <CRow>
      <CCol lg={4}>
        <h4>Sudah Terima dari: </h4>
      </CCol>
      <CCol lg={8}>
        {record.receiver_name}
      </CCol>
    </CRow>
    <CRow>
      <CCol lg={4}>
        <h4>Untuk Pembayaran biaya Pengiriman: </h4>
      </CCol>
      <CCol lg={8}>
        {record.description}
      </CCol>
    </CRow>
    <CRow>
      <CCol lg={3}>
        <span className="h4">Merk: </span><span>{record.sender_name}</span>
      </CCol>
      <CCol lg={3}>
        <span className="h4">KM: </span><span>{record.ship_name}</span>
      </CCol>
      <CCol lg={3}>
        <span className="h4">Tgl: </span><span>{dateFormat(record.transaction_date) }</span>
      </CCol>
      <CCol lg={3}>
        <span className="h4">Tujuan: </span><span>{record.destination_port_name} ({record.destination_port_city})</span>
      </CCol>
    </CRow>
    <CRow>
      <CCol lg={3}>
        <h4>Dengan perincian sbb: </h4>
      </CCol>
      <CCol lg={9}>
        {record.packing_details_attributes.map(line =>{
          return (
            <CRow key={line.id}>
              <CCol lg={8}>{line.description}</CCol>
              <CCol lg={4}>Rp. {line.send_cost}</CCol>
            </CRow>
          )
        })}
        <hr/>
        <CRow>
          <CCol lg={8}>DPP</CCol>
          <CCol lg={4}>Rp. {record.subtotal}</CCol>
        </CRow>
        <CRow>
          <CCol lg={8}>PPN</CCol>
          <CCol lg={4}>Rp. {record.tax_amount}</CCol>
        </CRow>
        <hr/>
        <CRow>
          <CCol lg={8}><div className="text-end">Jumlah </div></CCol>
          <CCol lg={4}>Rp. {record.grandtotal}</CCol>
        </CRow>
      </CCol>
    </CRow>
    <CRow>
      <CCol lg={2}><h4>Terbilang : </h4></CCol>
      <CCol lg={10}><div className="box-trapezium">{numberToWord(record.grandtotal)} rupiah</div></CCol>
    </CRow>
    <CRow>
      <CCol lg={6}><CompanyFooter company={company}/></CCol>
      <CCol lg={6}><div className="text-end">{company.city}, {today}</div></CCol>
    </CRow>
  </div>)
})

export default InvoicePrint

