class Port < ApplicationRecord
  attribute :country, :string, default: 'indonesia'

  validates :name, presence: true
  validates :city, presence: true
  validates :country, presence: true
end
