class CompaniesController < ApplicationController
  before_action :authorize_user_based_action!, except:[:show,:image]
  skip_before_action :verify_authenticity_token

  def show
    find_record
    render json: @record
  end

  def update
    permitted_params = params
      .required(:company)
      .permit(:name, :company_image,:company_image_name, :company_icon,:company_icon_name, :address, :bank, :bank_account,
              :bank_register_name, :city, :tax_account,contact_numbers:[:contact_type,:value])
    company_form = CompanyForm.new(permitted_params)
    if company_form.save_to_setting
      data = company_form.attributes
      decorate_response(data)
      render json: {message: 'sukses simpan',data: data}, status: :ok
    else
      render_json_error(company_form)
    end
  end

  def image
    find_record
    Rails.logger.debug "== #{@record}"
    if params[:type] == 'icon'
      send_file Rails.root.join('app','assets','images',@record['company_icon_name'] || '')
    else
      send_file Rails.root.join('app','assets','images',@record['company_image_name'] || '')
    end
  rescue
    head :no_content
  end

  private

  def find_record
    data = SystemSetting.get('company') || {}
    company = CompanyForm.new(data).attributes
    decorate_response(company)
    @record = company
  end
  def decorate_response(company)
    company['company_image_path'] = company_image_path if company['company_image_name'].present?
    company['company_icon_path'] = company_image_path(type: 'icon') if company['company_icon_name'].present?
  end
end
