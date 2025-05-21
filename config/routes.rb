Rails.application.routes.draw do
  resources :ships, except: :destroy
  resources :ports, except: :destroy
  resources :products
  resources :ship_schedules, except: :destroy do
    ShipSchedule.statuses.each do |key, int_value|
      post "set_#{key}", on: :member
    end
  end
  resources :containers, except: :destroy
  resources :packing_lists, except: :destroy
  resources :roles, except: :destroy
  resources :container_types, except: :destroy
  resources :suppliers, except: :destroy
  resources :customers, except: :destroy
  resources :agents, except: :destroy
  resources :packing_lists, except: :destroy


  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  resources :users do
    post :activate, on: :member
    post :deactivate, on: :member
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get 'dashboard-old' => 'home#dashboard2'
  # Defines the root path route ("/")
  root "home#dashboard"
end
