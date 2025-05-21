json.id @record.id
json.name @record.name
json.product_type @record.product_type
json.weight @record.weight
json.dimension_p @record.dimension_p
json.dimension_l @record.dimension_l
json.dimension_t @record.dimension_t
json.view_path product_path(id: @record.id)
json.edit_path edit_product_path(id: @record.id)
json.created_at @record.created_at
json.updated_at @record.updated_at
