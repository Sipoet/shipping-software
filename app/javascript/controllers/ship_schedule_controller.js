import DataTable from 'datatables.net-bs5'
import 'datatables.net-colreorder-dt'
import 'datatables.net-fixedcolumns-dt'
import 'datatables.net-fixedheader-dt'
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  initialize() {
    this.table = new DataTable('#ship-schedule-table',{
      scrollX: true,
      ajax: 'ship_schedules.json',
      orderCellsTop: true,
      fixedHeader: {
        header: true,
        headerOffset: 110
      },
      colReorder: true,
      pageLength: 25,
      columns: [
        { data: 'ship_name', name:'ships.name' },
        { data: 'status' },
        { data: 'voyage' },
        { data: 'loading_port_detail' },
        { data: 'destination_port_detail' },
        { data: 'estimated_arrived_sour_at', type: 'date' },
        { data: 'estimated_departure_sour_at', type: 'date' },
        { data: 'estimated_departure_dest_at', type: 'date' },
        { data: 'actual_arrived_sour_at', type: 'date' },
        { data: 'actual_departure_sour_at', type: 'date' },
        { data: 'actual_departure_dest_at', type: 'date' },
        { data: 'dorry_container_opened_at', type: 'date' },
        { data: 'booking_code' },
        { data: 'created_at', type: 'date'},
        { data: 'updated_at', type: 'date'},
        { data: 'action', orderable: false },
      ],
      columnDefs:[
        {
          render: (data, type, row) => `<a href="${row.view_path}" style="text-decoration:none;">${row.ship_name}</a>`,
          targets: 0
        },
        {
          data: 'estimated_arrived_sour_at',
          render: (data, type, row) => data == null ? '' : new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: 5
        },
        {
          data: 'estimated_departure_sour_at',
          render: (data, type, row) => data == null ? '' : new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: 6
        },
        {
          data: 'estimated_departure_dest_at',
          render: (data, type, row) => data == null ? '' : new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: 7
        },
        {
          data: 'actual_arrived_sour_at',
          render: (data, type, row) => data == null ? '' : new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: 8
        },
        {
          data: 'actual_departure_sour_at',
          render: (data, type, row) => data == null ? '' : new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: 9
        },
        {
          data: 'actual_departure_dest_at',
          render: (data, type, row) => data == null ? '' : new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: 10
        },
        {
          data: 'dorry_container_opened_at',
          render: (data, type, row) => data == null ? '' : new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: 11
        },
        {
          data: 'created_at',
          render: (data, type, row) => new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: -3
        },
        {
          data: 'updated_at',
          render: (data, type, row) => new Date(data).toLocaleDateString('id',
              {day:'2-digit', month:'2-digit',year:'numeric',
                hour:'2-digit',minute:'2-digit'})
          ,
          targets: -2
        },
        { data: null,
          render:(data,type,row) => `<a href="${row.edit_path}" class="btn btn-primary">Edit</a>`,
          defaultContent: '<button type="button" class="btn edit btn-primary">Edit</button>',
          targets: -1
         },
      ],
      processing: true,
      serverSide: true
    })
  }

  columnFilter(event){
    let index = event.target.dataset.columnIndex
    let column = this.table.column(index)
    let isRegex = true
    if(column.type()=='date'){
      isRegex = false
    }
    column.search(event.target.value,isRegex,false,true)
        .draw()
  }
}
