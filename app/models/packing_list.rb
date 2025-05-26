class PackingList < ApplicationRecord
  DEFAULT_VOLUME_UOM = 'm3'
  DEFAULT_WEIGHT_UOM = 'kg'
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
  validates :transaction_date, presence: true

  belongs_to :container, optional: true
  belongs_to :sender, class_name: 'Customer'
  belongs_to :receiver, class_name: 'Customer'

  has_many :packing_details, dependent: :destroy, inverse_of: :packing_list
  has_one :ship, through: :container

  accepts_nested_attributes_for :packing_details, allow_destroy: true

  before_validation :calculate_total

  private

  def calculate_total
    self.total_item = 0
    self.total_volume = 0
    self.subtotal = 0
    self.total_weight= 0
    self.volume_uom ||= DEFAULT_VOLUME_UOM
    self.weight_uom ||= DEFAULT_WEIGHT_UOM
    packing_details.each do |line|
      self.total_item += line.quantity
      self.total_volume += line.total_volume
      self.total_weight += line.total_weight
      self.subtotal += line.send_cost
    end
    self.grandtotal = subtotal + tax_amount
    Rails.logger.debug "#{self.attributes}"
  end
end
