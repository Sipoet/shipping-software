json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|
    product = record.product
    if product.present?
      json.product_name product.name
      json.product_id record.product_id
      json.product_path customer_path(record.product_id)
    end
    json.id record.id
    json.total_dimension_p record.total_dimension_p
    json.total_dimension_l record.total_dimension_l
    json.total_dimension_t record.total_dimension_t
    json.description record.description
    json.total_weight record.total_weight
    json.total_volume record.total_volume
    json.weight_uom record.weight_uom
    json.volume_uom record.volume_uom
    json.send_cost record.send_cost
    json.quantity record.quantity
  end

end
