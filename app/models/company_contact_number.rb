class CompanyContactNumber
  include ActiveModel::API
  include ActiveModel::Validations
  include ActiveModel::Attributes

  attribute :contact_type, :string
  attribute :value, :string

  validates :value, presence: true
  validates :contact_type, inclusion:{in:['tel','wa','fax','phone']}
end
