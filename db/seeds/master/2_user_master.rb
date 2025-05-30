admin_password = ENV['ADMIN_PASSWORD']
if admin_password.present?
  user = User.find_or_initialize_by(username: 'superadmin')
  user.password = admin_password
  user.password_confirmation = admin_password
  user.email = 'ciptakarya@gmail.com'
  user.role = role
  user.save!
end
