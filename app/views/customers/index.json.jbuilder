json.total_pages @customers.total_pages
json.data do
  json.array! @customers do |record|
    json.id record.id
    default_port = record.default_port
    if default_port.present?
      json.default_port_detail "#{default_port.try(:name)} - #{default_port.try(:city)}"
      json.default_port_id record.default_port_id
      json.default_port_path port_path(record.default_port_id)
    end
    json.name record.name
    json.address record.address
    json.bank record.bank
    json.bank_account record.bank_account
    json.bank_register_name record.bank_register_name
    json.contact_number record.contact_number
    json.tax_account record.tax_account
    json.view_path customer_path(id: record.id)
    json.edit_path edit_customer_path(id: record.id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
