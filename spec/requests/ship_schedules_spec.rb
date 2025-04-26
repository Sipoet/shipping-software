require 'rails_helper'

RSpec.describe "ShipSchedules", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/ship_schedules/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/ship_schedules/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/ship_schedules/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/ship_schedules/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/ship_schedules/new"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/ship_schedules/edit"
      expect(response).to have_http_status(:success)
    end
  end

end
