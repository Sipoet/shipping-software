json.id @record.id
sender = @record.sender
if sender.present?
  json.sender_name sender.name
  json.sender_id @record.sender_id
  json.sender_path customer_path(@record.sender_id)
end
receiver = @record.receiver
if receiver.present?
  json.receiver_name receiver.name
  json.receiver_id @record.receiver_id
  json.receiver_path customer_path(@record.receiver_id)
end
container = @record.container
if container.present?
  json.container_detail container.container_number
  json.container_id @record.container_id
  json.container_path container_path(@record.container_id)
end
json.total_item @record.total_item
json.total_weight @record.total_weight
json.weight_uom @record.weight_uom
json.total_volume @record.total_volume
json.volume_uom @record.volume_uom
json.grandtotal @record.grandtotal
json.subtotal @record.subtotal
json.tax_amount @record.tax_amount
json.description @record.description
json.code @record.code
json.created_at @record.created_at
json.updated_at @record.updated_at
json.packing_details do
  json.array! @record.packing_details do |line|
    product = line.product
    if product.present?
      json.product_name product.name
      json.product_id line.product_id
      json.product_path customer_path(line.product_id)
    end
    json.id line.id
    json.total_dimension_p line.total_dimension_p
    json.total_dimension_l line.total_dimension_l
    json.total_dimension_t line.total_dimension_t
    json.description line.description
    json.total_weight line.total_weight
    json.total_volume line.total_volume
    json.weight_uom line.weight_uom
    json.volume_uom line.volume_uom
    json.send_cost line.send_cost
    json.quantity line.quantity
  end

end
