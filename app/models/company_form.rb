require 'mime/types'
class CompanyForm
  include ActiveModel::API
  include ActiveModel::Validations
  include ActiveModel::Attributes

  attribute :name, :string, default: ''
  attribute :company_image
  attribute :company_icon
  attribute :address, :string, default: ''
  attribute :bank, :string, default: ''
  attribute :bank_account, :string, default: ''
  attribute :bank_register_name, :string, default: ''
  attribute :tax_account, :string, default: ''
  attribute :city, :string, default: ''
  attribute :contact_numbers, array: true, default: []
  attribute :company_image_name,:string
  attribute :company_icon_name,:string

  validates :name, presence: true
  validates :city, presence: true
  validates :address, presence: true

  validate :company_image_valid
  validate :company_icon_valid
  validate :each_of_contact_numbers

  def save_to_setting
    return false unless valid?
    old = SystemSetting.get('company') || {}
    Rails.logger.debug "===old #{old}"
    deleted_image = []
    image_path = save_image_file(company_image)
    if image_path.present?
      deleted_image << old['company_image_name']
      self.company_image_name = image_path
      self.company_image = nil
    end
    image_path = save_image_file(company_icon)
    if image_path.present?
      deleted_image << old['company_icon_name']
      self.company_icon_name = image_path
      self.company_icon = nil
    end
    SystemSetting.set!('company', attributes)
    deleted_image.compact.each do |filename|
      Rails.logger.debug "====delete file #{filename}"
      File.delete(Rails.root.join('app','assets','images',filename))
    end
  end

  def each_of_contact_numbers
    contact_numbers.each do |contact_number|
      contact_number = CompanyContactNumber.new(contact_number)
      next if contact_number.valid?
      errors.add(:contact_numbers,contact_number.errors.full_messages.join(', '))
    end
  end

  private

  def save_image_file(file)
    return nil if file.blank?
    ext = file.path.split('.').last
    image_name = "#{SecureRandom.hex(12)}.#{ext}"
    image_path = Rails.root.join('app','assets','images',image_name)
    File.binwrite(image_path, file.read)
    image_name
  end

  def company_icon_valid
    return if company_icon.blank?
    if File.size(company_icon.path) > 500.kilobytes
      errors.add(:company_icon,'file tidak boleh lebih dari 500 KB')
      return
    end
    if !media_type_image?(company_icon.path)
      errors.add(:company_icon,'file bukan gambar')
    end
  end

  def company_image_valid
    return if company_image.blank?
    if File.size(company_image.path) > 1.megabytes
      errors.add(:company_image,'file tidak boleh lebih dari 1 MB')
      return
    end
    if !media_type_image?(company_image.path)
      errors.add(:company_image,'file bukan gambar')
    end
  end

  def media_type_image?(local_file_path)
    MIME::Types.type_for(local_file_path).first.try(:media_type) == 'image'
  end
end
