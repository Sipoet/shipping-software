superadmin_role = Role.find_by(name: 'superadmin')
[
  {username:'reidy',password:'masuk123'},
  {username:'eddy',password:'eddy123456789'},
  {username:'timi',password:'timi123456789'},
].each do |data|
  user = User.find_or_initialize_by(username: data[:username])
  user.password = data[:password]
  user.is_active = true
  user.password_confirmation = data[:password]
  user.email = "#{user.username}@ciptakarya.com"
  user.role = superadmin_role
  user.save
end
