class ShipSchedule < ApplicationRecord

  enum :status, {
    draft: 0,
    cancelled: 1,
    port_processed: 2,
    si_released: 3, #shipment of instruction released
    ship_aboard: 4,
    arrived_to_destination: 5,
    completed: 6
  }

  validates :voyage, presence: true
  validates :estimated_arrived_sour_at, presence: true
  validates :estimated_departure_sour_at, presence: true
  validates :estimated_arrived_dest_at, presence: true

  validates :actual_arrived_sour_at, presence: true, if: :si_released?
  validates :actual_departure_sour_at, presence: true, if: :ship_aboard?
  validates :actual_arrived_dest_at, presence: true, if: :arrived_to_destination?
  validates :loading_port, presence: true, if: :port_processed?
  validates :destination_port, presence: true, if: :port_processed?
  validates :dorry_container_opened_at, presence: true, if: :completed?

  has_many :containers, inverse_of: :ship_schedule, dependent: :destroy

  belongs_to :loading_port, class_name: 'Port', foreign_key: :loading_port_id
  belongs_to :destination_port, class_name: 'Port', foreign_key: :destination_port_id
  belongs_to :ship, optional: true


end
