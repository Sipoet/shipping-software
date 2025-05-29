20.times do |index|
  Agent.find_or_create_by!(
    name:"Agen #{Agent.all.count + 1}",
    address:'Jalan ',
    bank:['bca','mandiri','bri'].sample,
    bank_account:SecureRandom.random_number(99999999999999).to_s,
    bank_register_name:"Agen #{Agent.all.count + 1}",
    contact_number:"62#{SecureRandom.random_number(9999999999)}",
    tax_account:SecureRandom.random_number(99999999999999).to_s,
    default_port_id: Port.all.sample.id)
end

20.times do |index|
  Customer.find_or_create_by!(
    name:"Pelanggan #{Customer.all.count + 1}",
    address:'Jalan ',
    bank:['bca','mandiri','bri'].sample,
    bank_account:SecureRandom.random_number(99999999999999).to_s,
    bank_register_name:"Pelanggan #{Customer.all.count + 1}",
    tax_account:SecureRandom.random_number(99999999999999).to_s,
    contact_number:"62#{SecureRandom.random_number(9999999999)}")
end
