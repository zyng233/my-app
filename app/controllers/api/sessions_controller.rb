class Api::SessionsController < ApplicationController
  # log in without autheticated
  skip_before_action :authorize_request, only: :create

  def create
    user = User.find_by(username: params[:username])
    
    if user&.authenticate(params[:password])
      token = encode_token(user_id: user.id)
      render json: { user: user, token: token }
    else
      render json: { error: 'Invalid username or password' }, status: :unauthorized
    end
  end
end

  