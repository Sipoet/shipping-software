json.total_pages @ships.total_pages
json.data do
  json.array! @ships do |ship|
    json.id ship.id
    json.name ship.name
    json.created_at ship.created_at
    json.updated_at ship.updated_at
    json.view_path ship_path(id: ship.id)
    json.edit_path edit_ship_path(id: ship.id)
  end
end
