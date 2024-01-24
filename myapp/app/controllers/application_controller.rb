class ApplicationController < ActionController::API
  before_action :authorize_request, unless: -> { request.path_info == '/' }
    
    def devise_mapping
      @devise_mapping ||= Devise.mappings[:user]
    end
    
    def encode_token(payload)
      JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
    end
  
    def decode_token(token)
      if token.blank?
        raise JWT::DecodeError, "Nil or blank JSON web token"
      end

      begin
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        return decoded
      rescue JWT::DecodeError => e
        raise json: { errors: e.message }, status: :unauthorized
      rescue JWT::ExpiredSignature
        render json: { errors: 'Token has expired' }, status: :unauthorized      
      end
    end
  
    private

    def current_user
      @current_user
    end

    def authorize_request
      header = request.headers['Authorization']
      token = header.split(' ').last if header
    
      unless token
        render json: { errors: 'Missing token' }, status: :unauthorized
        return
      end
    
      begin
        @decoded = decode_token(token)
        username = @decoded['username']
        @current_user = User.find_by(username: username)
    
        unless @current_user
          render json: { errors: 'User not found' }, status: :unauthorized
          return
        end
    
      rescue ActiveRecord::RecordNotFound => e
        render json: { errors: e.message }, status: :unauthorized
      rescue JWT::DecodeError => e
        render json: { errors: e.message }, status: :unauthorized
      rescue JWT::ExpiredSignature
        render json: { errors: 'Token has expired' }, status: :unauthorized
      end
    end
  
  end
  
