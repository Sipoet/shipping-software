class PackingList < ApplicationRecord

  validates :quantity, presence: true
  validates :total_weight, presence: true, numericality: {greater_than: 0}
  validates :price, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :unit_of_measurement, presence: true
  validates :total_dimension_p, presence: true, numericality: {greater_than: 0}
  validates :total_dimension_l, presence: true, numericality: {greater_than: 0}
  validates :total_dimension_t, presence: true, numericality: {greater_than: 0}
  validates :customer, presence: true
  validates :supplier, presence: true
  validates :product, presence: true

  belongs_to :container, optional: true
  belongs_to :customer
  belongs_to :supplier
  belongs_to :product

end
