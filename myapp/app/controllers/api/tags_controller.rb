class Api::TagsController < ApplicationController
  before_action :log_authorization_header, only: :index
  before_action :authorize_request
  before_action :set_tag, only: [:show, :update, :destroy]

    def index
      @tags = Tag.all
      render json: @tags
    end
  
    def show
      render json: @tag
    end
  
    def create
      tag = Tag.find_or_create_by(name: tag_name.downcase)
  
      if @tag.save
        render json: @tag, status: :created, location: @tag
      else
        render json: @tag.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @tag.update(tag_params)
        render json: @tag
      else
        render json: @tag.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @tag.destroy
    end
  
    private
  
    def set_tag
      @tag = Tag.find(params[:id])
    end
  
    def tag_params
      params.require(:tag).permit(:name)
    end
  end
  
