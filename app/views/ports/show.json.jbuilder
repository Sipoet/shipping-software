json.id @record.id
json.name @record.name
json.city @record.city
json.country @record.country
json.created_at @record.created_at
json.updated_at @record.updated_at
json.view_path port_path(id: @record.id)
json.edit_path edit_port_path(id: @record.id)
