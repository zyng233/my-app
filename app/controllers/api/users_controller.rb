class Api::UsersController < ApplicationController
    skip_before_action :authorize_request, only: :create
  
    def create
      user = User.new(user_params)
      Rails.logger.info("Received Parameters: #{params.inspect}")
      puts "User before validation: #{user.inspect}"

      if user_exists?(user.username, user.matric_no)
        render json: { errors: ['Username or Matric Number is already used.'] }, status: :unprocessable_entity
        return
      end

      Rails.logger.info("User before save: #{user.inspect}")
      user.password = params[:password]
      
      if user.save
        token = encode_token(user_id: user.id)
        render json: { user: user, token: token }, status: :created
      else
        puts "User validation errors: #{user.errors.full_messages}"
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end

      Rails.logger.info("Generated Token: #{token}")

    end
  
    private
  
    def user_params
      params.require(:user).permit(:username, :matric_no, :password)
    end

    def user_exists?(username, matric_no)
      username_exists = User.exists?('username' => username)
      matric_no_exists = User.exists?('matric_no' => matric_no)
    
      username_exists || matric_no_exists
    end
  end
  