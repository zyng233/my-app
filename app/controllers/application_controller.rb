class ApplicationController < ActionController::API
    before_action :authorize_request, unless: -> { request.path_info == '/' }
  
    def encode_token(payload)
      JWT.encode(payload, Rails.application.credentials.secret_key_base)
    end
  
    def decode_token(token)
      Rails.logger.info("Received Token: #{token}")
      
      if token.blank?
        Rails.logger.error("Received token is blank or nil.")
        raise JWT::DecodeError, "Nil or blank JSON web token"
      end

      begin
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        Rails.logger.info("Decoded Token: #{decoded}")
        return decoded
      rescue JWT::DecodeError => e
        Rails.logger.error("JWT Decode Error: #{e.message}")
        raise e
      end
    end
  
    def authorize_request
      Rails.logger.info("Authorizing request...")
      log_authorization_header 
      header = request.headers['Authorization']
      token = header.split(' ').last if header
      Rails.logger.info("Received Token: #{token}")

      unless token
        render json: { errors: 'Missing token' }, status: :unauthorized
        return
      end

      begin
        @decoded = decode_token(token)
        @current_user = User.find(@decoded['user_id'])
        Rails.logger.info("Authorized User: #{@current_user}")
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error("Record Not Found: #{e.message}")
        render json: { errors: e.message }, status: :unauthorized
      rescue JWT::DecodeError => e
        Rails.logger.error("JWT Decode Error: #{e.message}")
        render json: { errors: e.message }, status: :unauthorized
      end
    end

    private

    def log_authorization_header
      header = request.headers['Authorization']
      Rails.logger.info("Authorization Header: #{header}")
    end
  end
  
