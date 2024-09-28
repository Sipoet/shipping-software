class Product < ApplicationRecord

  enum :product_type, {
    0 => :other,
    1 => :foods,
    2 => :electronic_appliance,
    3 => :chemical,
    4 => :cosmetics,
    5 => :building_tools,
    6 => :furniture
  }
end
