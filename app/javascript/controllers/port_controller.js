import DataTable from 'datatables.net-bs5'
import 'datatables.net-colreorder-dt'
import 'datatables.net-fixedcolumns-dt'
import 'datatables.net-fixedheader-dt'
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  initialize() {
    this.table = new DataTable('#port-table',{
      scrollX: true,
      ajax: 'ports.json',
      orderCellsTop: true,
      fixedHeader: {
        headerOffset: 110
      },
      colReorder: true,
      pageLength: 25,
      columns: [
        { data: 'name' },
        { data: 'city' },
        { data: 'country' },
        { data: 'created_at', type: 'date'},
        { data: 'updated_at', type: 'date'},
        { data: 'action', orderable: false },
      ],
      columnDefs:[
        {
          render: (data, type, row) => `<a href="${row.view_path}" style="text-decoration:none;">${row.name}</a>`,
          targets: 0
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
          render: (data, type, row) => new Date(row.updated_at).toLocaleDateString('id',
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
    console.log(column.type())
    if(column.type()=='date'){
      isRegex = false
    }
    column.search(event.target.value,isRegex,false,true)
        .draw()
  }
}
