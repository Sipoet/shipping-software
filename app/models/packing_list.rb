class PackingList < ApplicationRecord

  validates :total_item, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :total_weight, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :grandtotal, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :subtotal, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :total_volume, presence: true, numericality: {greater_than_or_equal_to: 0}
  validates :volume_uom, presence: true
  validates :weight_uom, presence: true
  validates :code, presence: true
  validates :sender, presence: true
  validates :receiver, presence: true

  belongs_to :container, optional: true
  belongs_to :sender, class_name: 'Customer'
  belongs_to :receiver, class_name: 'Customer'

  has_many :packing_details, dependent: :destroy, inverse_of: :packing_list

  accepts_nested_attributes_for :packing_details

end
