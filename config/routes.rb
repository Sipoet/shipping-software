Rails.application.routes.draw do
  get "companies/show"
  get "companies/update"
  constraints(lambda { |req| req.format == :json })  do
    resources :ships, except: [:new,:edit,:destroy]
    resources :ports, except: [:new,:edit,:destroy]
    resources :products, except: [:new,:edit]
    resources :ship_schedules, except: [:new,:edit,:destroy] do
      ShipSchedule.statuses.keys.each do |key|
        post "set_#{key}", on: :member
      end
    end
    resources :containers, except: [:new,:edit,:destroy]
    resources :packing_lists, except: [:new,:edit,:destroy]
    resources :roles, except: [:new,:edit,:destroy]
    resources :container_types, except: [:new,:edit,:destroy]
    resources :customers, except: [:new,:edit,:destroy]
    resources :agents, except: [:new,:edit,:destroy]
    resources :packing_details, except: [:new,:edit]
    resources :users, except: [:new,:edit] do
      post :activate, on: :member
      post :deactivate, on: :member
    end

    scope :system_settings do
      get 'company' => 'companies#show'
      put 'company' => 'companies#update'
    end

    resources :system_settings, only: [:index,:show,:update]



  end

  devise_scope :user do
    post "users/refresh_token", to: "users/sessions#refresh_token"
  end

  devise_for :users,only:[:sessions], controllers: {
    sessions: 'users/sessions'
  }

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get 'company_image'=> 'companies#image'
  # Defines the root path route ("/")
  root 'home#dashboard'

  get '*path' => 'home#dashboard', constraints: lambda { |req| req.format == :html || req.format == nil }

end
