json.total_pages @records.total_pages
json.data do
  json.array! @records do |port|
    json.id port.id
    json.name port.name
    json.city port.city
    json.country port.country
    json.created_at port.created_at
    json.updated_at port.updated_at
    json.view_path port_path(id: port.id)
  end
end
