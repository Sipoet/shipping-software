user = User.find_or_initialize_by(username: 'reidy')
  user.password = 'masuk123'
  user.password_confirmation = 'masuk123'
  user.email = 'ciptakarya@gmail.com'
  user.role = Role.find_or_create_by!(name: 'superadmin')
  user.save!
