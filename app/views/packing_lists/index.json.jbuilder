json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|
    json.id record.id
    sender = record.sender
    if sender.present?
      json.sender_detail sender.name
      json.sender_id record.sender_id
      json.sender_path customer_path(record.sender_id)
    end
    reciever = record.reciever
    if reciever.present?
      json.reciever_detail reciever.name
      json.reciever_id record.reciever_id
      json.reciever_path customer_path(record.reciever_id)
    end
    container = record.container
    if container.present?
      json.container_detail container.container_number
      json.container_id record.container_id
      json.container_path container_path(record.container_id)
    end
    json.total_item record.total_item
    json.total_weight record.total_weight
    json.weight_uom record.weight_uom
    json.total_volume record.total_volume
    json.volume_uom record.volume_uom
    json.grandtotal record.grandtotal
    json.subtotal record.subtotal
    json.tax_amount record.tax_amount
    json.description record.description
    json.code record.code
    json.view_path packing_list_path(id: record.id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
