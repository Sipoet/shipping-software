class Container < ApplicationRecord

  enum order_type: {
    less_container_load: 0,
    full_container_load: 1
  }

  validates :container_number, presence: true
  validates :order_type, presence: true

  belongs_to :agent, class_name: 'Client'
  belongs_to :container_type, optional: true
  belongs_to :ship_schedule, inverse_of: :containers, optional: true
  has_many :packing_lists, inverse_of: :container
  has_one :ship, through: :ship_schedule
end
