json.total_pages @packing_lists.total_pages
json.data do
  json.array! @packing_lists do |record|
    json.id record.id
    customer = record.customer
    if customer.present?
      json.customer_detail customer.name
      json.customer_id record.customer_id
      json.customer_path customer_path(record.customer_id)
    end
    supplier = record.supplier
    if supplier.present?
      json.supplier_detail supplier.name
      json.supplier_id record.supplier_id
      json.supplier_path supplier_path(record.supplier_id)
    end
    product = record.product
    if product.present?
      json.product_detail product.name
      json.product_id record.product_id
      json.product_path product_path(record.product_id)
    end
    container = record.container
    if container.present?
      json.container_detail container.container_number
      json.container_id record.container_id
      json.container_path container_path(record.container_id)
    end
    json.name record.name
    json.quantity record.quantity
    json.total_weight record.total_weight
    json.price record.price
    json.unit_of_measurement record.unit_of_measurement
    json.total_dimension_p record.total_dimension_p
    json.total_dimension_l record.total_dimension_l
    json.total_dimension_t record.total_dimension_t
    json.view_path packing_list_path(id: record.id)
    json.edit_path edit_packing_list_path(id: record.id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
