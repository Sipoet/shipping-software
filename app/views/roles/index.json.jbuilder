json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|
    json.id record.id
    json.name record.name
    json.created_at record.created_at
    json.updated_at record.updated_at
    json.view_path role_path(id: record.id)
  end
end
