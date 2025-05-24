class PackingDetail < ApplicationRecord

  validates :packing_list, presence: true
  validates :total_weight, presence: true,numericality:{greater_than: 0}
  validates :weight_uom, presence: true
  validates :total_volume, presence: true,numericality:{greater_than: 0}
  validates :volume_uom, presence: true
  validates :send_cost, presence: true,numericality:{greater_than_or_equal_to: 0}
  validates :quantity,numericality:{greater_than: 0}, absence: true

  belongs_to :product, optional: true
  belongs_to :packing_list, inverse_of: :packing_details

end
