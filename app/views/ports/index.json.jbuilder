json.total_pages @ports.total_pages
json.data do
  json.array! @ports do |port|
    json.id port.id
    json.name port.name
    json.city port.city
    json.country port.country
    json.created_at port.created_at
    json.updated_at port.updated_at
    json.view_path port_path(id: port.id)
    json.edit_path edit_port_path(id: port.id)
  end
end
