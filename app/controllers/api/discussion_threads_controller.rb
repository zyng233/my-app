class Api::DiscussionThreadsController < ApplicationController
  before_action :authorize_request
  before_action :set_discussion_thread, only: [:show, :update, :destroy]

  def index
    @discussion_threads = DiscussionThread.all
    render json: @discussion_threads, include: :tags
  end

  def show
    render json: @discussion_thread, include: :tags
  end

  def create
    Rails.logger.info("Received a request to create a new discussion thread.")
    @discussion_thread = DiscussionThread.new(discussion_thread_params)
    @discussion_thread.username = current_user.username

    if @discussion_thread.save
      tag_ids = []
  
      tag_names = params.dig(:discussion_thread, :tag_names)
    
      if tag_names.is_a?(Array)
        tag_names.each do |tag_name|
          tag = Tag.find_or_create_by(name: tag_name)
          tag_ids << tag.id
  
          tagging = Tagging.new(discussion_thread_id: @discussion_thread.id, tag_id: tag.id)
          tagging.save
        end
      end

      Rails.logger.info("Discussion thread successfully created with ID: #{@discussion_thread.id}")
      Rails.logger.info("Associated tag IDs: #{tag_ids}")
  
      render json: @discussion_thread, status: :created
    else
      Rails.logger.error("Failed to create discussion thread. Errors: #{@discussion_thread.errors.full_messages}")
      render json: { errors: @discussion_thread.errors.full_messages }, status: :unprocessable_entity
    end
  end  

  def update
    if @discussion_thread.update(discussion_thread_params)
      render json: @discussion_thread
    else
      render json: @discussion_thread.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @discussion_thread.destroy
  end

  private

  def set_discussion_thread
    @discussion_thread = DiscussionThread.find(params[:id])
  end

  def discussion_thread_params
    params.require(:discussion_thread).permit(:title, :content, tag_names: [], :username => [])
  end   
end


  