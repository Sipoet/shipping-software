json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|
    json.id record.id
    json.name record.name
    json.weight record.weight
    json.dimension_p record.dimension_p
    json.dimension_l record.dimension_l
    json.dimension_t record.dimension_t
    json.view_path container_type_path(id: record.id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
