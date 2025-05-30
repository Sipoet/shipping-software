class RoleAuth < ApplicationRecord

  validates :auth_controller, presence: true
  validates :auth_action, presence: true

  belongs_to :role, inverse_of: :role_auths
end
