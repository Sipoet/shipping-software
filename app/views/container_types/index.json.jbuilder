json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|
    json.id record.id
    json.name record.name
    json.description record.description
    json.view_path container_type_path(id: record.id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
