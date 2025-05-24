5.times do |index|
  Agent.find_or_create_by!(
    name:"Agen #{index + 1}",
    address:'Jalan ',
    bank:['bca','mandiri','bri'].sample,
    bank_account:'12356',
    bank_register_name:"Agen #{index+1}",
    contact_number:'6284584048',
    tax_account:'123543534',
    default_port_id: Port.all.sample.id)
end

5.times do |index|
  Customer.find_or_create_by!(
    name:"Pelanggan #{index + 1}",
    address:'Jalan ',
    bank:['bca','mandiri','bri'].sample,
    bank_account:'12356',
    bank_register_name:"Pelanggan #{index+1}",
    tax_account:'123543534',
    contact_number:'6284584048')
end

5.times do |index|
  Supplier.find_or_create_by!(
    name:"Supplier #{index + 1}",
    address:'Jalan ',
    bank:['bca','mandiri','bri'].sample,
    bank_account:'12356',
    bank_register_name:"Supplier #{index+1}",
    tax_account:'123543534',
    contact_number:'6284584048')
end
