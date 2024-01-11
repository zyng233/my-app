class ApplicationController < ActionController::API
  before_action :authorize_request, unless: -> { request.path_info == '/' }
    
    def devise_mapping
      @devise_mapping ||= Devise.mappings[:user]
    end
    
    def encode_token(payload)
      JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
    end
  
    def decode_token(token)
      log_received_token(token)
      
      if token.blank?
        log_error("Received token is blank or nil.")
        raise JWT::DecodeError, "Nil or blank JSON web token"
      end

      begin
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        log_decoded_token(decoded)
        return decoded
      rescue JWT::DecodeError => e
        log_error("JWT Decode Error: #{e.message}")
        raise json: { errors: e.message }, status: :unauthorized
      rescue JWT::ExpiredSignature
        log_error("JWT Expired Error: Token has expired")
        render json: { errors: 'Token has expired' }, status: :unauthorized      
      end
    end
  
    private

    def current_user
      @current_user
    end

    def authorize_request
      log_info("Authorizing request...")
      log_authorization_header 
      header = request.headers['Authorization']
      token = header.split(' ').last if header
      log_received_token(token)
    
      unless token
        render json: { errors: 'Missing token' }, status: :unauthorized
        return
      end
    
      begin
        @decoded = decode_token(token)
        log_received_token(token)
        log_decoded_token_payload(@decoded)
    
        username = @decoded['username']
        log_info("Decoded username: #{username}")
        log_decoded_username(username)
        @current_user = User.find_by(username: username)
    
        unless @current_user
          log_error("User not found for username: #{username}")
          render json: { errors: 'User not found' }, status: :unauthorized
          return
        end
    
        log_info("Authorized User: #{@current_user}")
      rescue ActiveRecord::RecordNotFound => e
        log_error("Record Not Found: #{e.message}")
        render json: { errors: e.message }, status: :unauthorized
      rescue JWT::DecodeError => e
        log_error("JWT Decode Error: #{e.message}")
        render json: { errors: e.message }, status: :unauthorized
      rescue JWT::ExpiredSignature
        log_error("JWT Expired Error: Token has expired")
        render json: { errors: 'Token has expired' }, status: :unauthorized
      end
    end
    
    def log_received_token(token)
      log_info("Received Token: #{token}") unless Rails.env.production?
    end
  
    def log_decoded_token(decoded)
      log_info("Decoded Token: #{decoded}") unless Rails.env.production?
    end
  
    def log_decoded_token_payload(decoded)
      log_info("Decoded Token Payload: #{decoded}") unless Rails.env.production?
    end
  
    def log_decoded_username(username)
      log_info("Decoded username: #{username}") unless Rails.env.production?
    end
  
    def log_loaded_user(user)
      log_info("Loaded User: #{user.inspect}") unless Rails.env.production?
    end
  
    def log_authorization_header
      header = request.headers['Authorization']
      Rails.logger.info("Authorization Header: #{header}")
    end

    def log_info(message)
      Rails.logger.info(message)
    end
  
    def log_error(message)
      Rails.logger.error(message)
    end

    def log_loaded_user(user)
      log_info("Loaded User: #{user.inspect}") unless Rails.env.production?
    end
  end
  
