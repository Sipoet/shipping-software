require 'rails_helper'

RSpec.describe "PackingLists", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/packing_lists/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/packing_lists/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/packing_lists/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/packing_lists/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/packing_lists/new"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/packing_lists/edit"
      expect(response).to have_http_status(:success)
    end
  end

end
