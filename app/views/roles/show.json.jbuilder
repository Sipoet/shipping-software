json.id @record.id
json.name @record.name

json.role_auths do
  json.array! @record.role_auths do |line|
    json.id line.id
    json.auth_controller line.auth_controller
    json.auth_action line.auth_action
  end
end
json.created_at @record.created_at
json.updated_at @record.updated_at
