json.id @record.id
json.username @record.username
json.is_active @record.is_active
json.email @record.email
role = @record.role
if role.present?
  json.role_id @record.role_id
  json.role_name role.name
  json.role_path role_path(@record.role_id)
end
