class Api::UsersController < ApplicationController
    skip_before_action :authorize_request, only: :create
  
    def create
      user = User.new(user_params)
      
      if user_exists?(user.username, user.matric_no)
        render json: { errors: ['Username or Matric Number is already used.'] }, status: :unprocessable_entity
        return
      end
      
      if user.save
        render json: { user: user, token: generate_token(user) }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end

    end
  
    private
  
    def user_params
      params.require(:user).permit(:username, :matric_no, :password)
    end

    def user_exists?(username, matric_no)
      User.exists?(username: username) || User.exists?(matric_no: matric_no)
    end

    def generate_token(user)
      payload = { username: user.username }
      JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
    end
end