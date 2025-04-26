class Product < ApplicationRecord

  enum :product_type, {
    other: 0,
    foods: 1,
    electronic_appliance: 2,
    chemical: 3,
    cosmetics: 4,
    building_tools: 5,
    furniture: 6
  }

  validates :name, presence: true
  validates :weight, numericality: true
  validates :dimension_p, numericality: true
  validates :dimension_l, numericality: true
  validates :dimension_t, numericality: true
  validates :product_type, presence: true

end
