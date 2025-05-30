role = Role.find_or_initialize_by(name: 'superadmin')
list_auth =JSON.parse(File.read(Rails.root.join('app','assets','json','authorizations.json')))
role.role_auths.destroy_all
role.role_auths.build(auth_controller: 'all', auth_action: 'all')
list_auth.each do |row|
  role.role_auths.build(auth_controller: row['resource'], auth_action: 'all')
end
role.save!
