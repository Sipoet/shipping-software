class Ship < ApplicationRecord

  paginates_per 20

  validates :name, presence: true
end
