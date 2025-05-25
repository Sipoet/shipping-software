json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|
    json.id record.id
    json.voyage record.voyage
    json.status record.status
    json.detail "#{record.estimated_departure_sour_at.strftime('%d %B %Y')} - #{record.estimated_arrived_dest_at.strftime('%d %B %Y')}"
    ship = record.ship
    if ship.present?
      json.ship_id ship.id
      json.ship_name ship.name
    end
    loading_port = record.loading_port
    if loading_port.present?
      json.loading_port_detail "#{loading_port.try(:name)} - #{loading_port.try(:city)}"
      json.loading_port_id record.loading_port_id
      json.loading_port_path port_path(record.loading_port_id)
    end
    destination_port = record.destination_port
    if destination_port.present?
      json.destination_port_id record.destination_port_id
      json.destination_port_detail "#{destination_port.try(:name)} - #{destination_port.try(:city)}"
      json.destination_port_path port_path(record.destination_port_id)
    end
    json.estimated_arrived_sour_at record.estimated_arrived_sour_at
    json.estimated_departure_sour_at record.estimated_departure_sour_at
    json.estimated_arrived_dest_at record.estimated_arrived_dest_at
    json.actual_arrived_sour_at record.actual_arrived_sour_at
    json.actual_departure_sour_at record.actual_departure_sour_at
    json.actual_arrived_dest_at record.actual_arrived_dest_at
    json.dorry_container_opened_at record.dorry_container_opened_at
    json.booking_code record.booking_code
    json.view_path ship_schedule_path(id: record.id)
    json.ship_path ship_path(record.ship_id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
