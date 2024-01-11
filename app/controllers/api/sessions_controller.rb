class Api::SessionsController < ApplicationController
  # log in without autheticated
  skip_before_action :authorize_request, only: :create

  def create
    user = User.find_by(username: params[:username])
    log_info("User username: #{user.username}, Password: #{params[:password]}")
  
    if user&.valid_password?(params[:password])
      sign_in user, store: false
      token = encode_token({ username: user.username })
      render json: { token: token }
    else
      render json: { errors: 'Invalid username or password' }, status: :unauthorized
    end
  end
end

  