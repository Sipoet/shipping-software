class ShipSchedule < ApplicationRecord

  enum :status, {
    draft: 0,
    cancelled: 1,
    port_processed: 2,
    si_released: 3, #shipment of instruction released
    ship_depart: 4,
    arrived_to_destination: 5,
    completed: 6
  }

  validates :voyage, presence: true
  validates :estimated_arrived_sour_at, presence: true, timeliness:{type: :datetime, ignore_usec: true, before: :estimated_departure_sour_at}
  validates :estimated_departure_sour_at, presence: true, timeliness:{type: :datetime, ignore_usec: true, after: :estimated_arrived_sour_at, before: :estimated_arrived_dest_at}
  validates :estimated_arrived_dest_at, presence: true, timeliness:{type: :datetime, ignore_usec: true, after: :estimated_departure_sour_at}

  validates :actual_arrived_sour_at, presence: true, timeliness:{type: :datetime, ignore_usec: true, before: :actual_departure_sour_at}, if: :si_released?
  validates :actual_departure_sour_at, presence: true,timeliness:{type: :datetime, ignore_usec: true, after: :actual_arrived_sour_at, before: :actual_arrived_dest_at}, if: :ship_depart?
  validates :actual_arrived_dest_at, presence: true,timeliness:{type: :datetime, ignore_usec: true, after: :actual_departure_sour_at}, if: :arrived_to_destination?
  validates :loading_port, presence: true
  validates :destination_port, presence: true
  validates :dorry_container_opened_at, presence: true,timeliness:{type: :datetime, ignore_usec: true, on_or_after: :actual_arrived_dest_at}, if: :completed?
  validates :booking_code, presence: true, if: :si_released?

  has_many :containers, inverse_of: :ship_schedule

  belongs_to :loading_port, class_name: 'Port', foreign_key: :loading_port_id
  belongs_to :destination_port, class_name: 'Port', foreign_key: :destination_port_id
  belongs_to :ship, optional: true


end
