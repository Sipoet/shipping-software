ship_ids = Ship.all.pluck(:id)
port_ids = Port.all.pluck(:id)
ShipSchedule.create!(
  ship_id: ship_ids.sample,
  booking_code: SecureRandom.hex(7),
  estimated_arrived_sour_at: DateTime.now  - 1.day,
  estimated_departure_sour_at: DateTime.now + 2.days,
  estimated_arrived_dest_at: DateTime.now + 3.days,
  # actual_arrived_sour_at: DateTime.now,
  # actual_departure_sour_at: DateTime.now + 1.days,
  # actual_arrived_dest_at: DateTime.now + 5.days,
  status: 0,
  loading_port_id: port_ids.sample,
  destination_port_id: port_ids.sample,
)


ShipSchedule.create!(
  ship_id: ship_ids.sample,
  booking_code: SecureRandom.hex(7),
  estimated_arrived_sour_at: DateTime.now  - 1.day,
  estimated_departure_sour_at: DateTime.now + 2.days,
  estimated_arrived_dest_at: DateTime.now + 3.days,
  # actual_arrived_sour_at: DateTime.now,
  # actual_departure_sour_at: DateTime.now + 1.days,
  # actual_arrived_dest_at: DateTime.now + 5.days,
  status: 1,
  loading_port_id: port_ids.sample,
  destination_port_id: port_ids.sample,
)

ShipSchedule.create!(
  ship_id: ship_ids.sample,
  booking_code: SecureRandom.hex(7),
  estimated_arrived_sour_at: DateTime.now  - 1.day,
  estimated_departure_sour_at: DateTime.now + 2.days,
  estimated_arrived_dest_at: DateTime.now + 3.days,
  actual_arrived_sour_at: DateTime.now,
  actual_departure_sour_at: DateTime.now + 1.days,
  # actual_arrived_dest_at: DateTime.now + 5.days,
  status: 3,
  loading_port_id: port_ids.sample,
  destination_port_id: port_ids.sample,
)
