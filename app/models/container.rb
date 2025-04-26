class Container < ApplicationRecord

  enum order_type: {
    less_container_load: 0,
    full_container_load: 1
  }
  validates :ship_schedule, presence: true
  validates :container_number, presence: true
  validates :order_type, presence: true
  belongs_to :agent, class_name: 'Client'
  belongs_to :ship
  belongs_to :ship_schedule, inverse_of: :containers
end
