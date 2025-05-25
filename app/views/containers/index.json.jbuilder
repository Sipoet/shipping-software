json.total_pages @records.total_pages
json.data do
  json.array! @records do |record|
    json.id record.id
    ship = record.ship
    if ship.present?
      json.ship_name ship.name
      json.ship_id ship.id
      json.ship_path ship_path(ship.id)
    end
    container_type = record.container_type
    if container_type.present?
      json.container_type_name container_type.name
      json.container_type_id container_type.id
      json.container_type_path container_type_path(container_type.id)
    end
    ship_schedule = record.ship_schedule
    if ship_schedule.present?
      json.ship_schedule_detail "#{ship_schedule.estimated_departure_sour_at.strftime('%d %B %Y')} - #{ship_schedule.estimated_arrived_dest_at.strftime('%d %B %Y')}"
      json.ship_schedule_id record.ship_schedule_id
      json.ship_schedule_path ship_schedule_path(record.ship_schedule_id)
    end
    json.container_number record.container_number
    json.order_type record.order_type
    agent = record.agent
    if agent.present?
      json.agent_name agent.name
      json.agent_id record.agent_id
      json.agent_path agent_path(record.agent_id)
    end
    json.view_path container_path(id: record.id)
    json.created_at record.created_at
    json.updated_at record.updated_at
  end
end
