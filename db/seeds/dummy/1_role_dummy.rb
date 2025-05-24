['accounting','manager','sales','driver'].each do |name|
  Role.find_or_create_by(name: name)
end
