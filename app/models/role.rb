class Role < ApplicationRecord

  validates :name, presence: true
  has_many :role_auths,inverse_of: :role, dependent: :destroy

end
