class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  validates :username, presence: true
  validate :username_valid


  belongs_to :role

  def active?
    is_active
  end

  private
  def username_valid
    if username&.strip&.downcase == 'profile'
      errors.add(:username,:invalid)
    end

    if username =~ /[^\d\w]/
      errors.add(:username,'tidak boleh ada spesial character & spasi')
    end
  end
end
