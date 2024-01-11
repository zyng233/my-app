Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'api/sessions',
    registrations: 'api/registrations'
  }, skip: :registrations

  namespace :api, defaults: { format: :json } do
    post '/login', to: 'sessions#create'
    post '/signup', to: 'users#create'
    resources :discussion_threads, only: [:index, :show, :create, :update, :destroy]
    resources :comments, only: [:index, :show, :create, :update, :destroy]
    resources :tags, only: [:index, :show, :create, :update, :destroy]
  end
end
