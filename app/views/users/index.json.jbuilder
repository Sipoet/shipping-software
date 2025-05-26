json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|

    json.username record.username
    json.status record.is_active ? 'Aktif' : 'Tidak Aktif'
    json.email record.email
    role = record.role
    if role.present?
      json.role_id record.role_id
      json.role_name role.name
      json.role_path role_path(record.role_id)
    end
    json.view_path user_path(id: record.id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
