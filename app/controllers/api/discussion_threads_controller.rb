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
      render json: @discussion_thread, status: :created
    else
      render json: { errors: @discussion_thread.errors.full_messages }, status: :unprocessable_entity
    end
  end  

  def update
    unless authorized_to_modify?
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end

    tag_names = params.dig(:tag_names) || []
    updated_params = discussion_thread_params.merge(tag_names: tag_names)
    
    Rails.logger.info("Received Parameters: #{params.inspect}")
    Rails.logger.info("Updated Params: #{updated_params}")

    if @discussion_thread.update(updated_params)
      update_tags(tag_names)
      Rails.logger.info("Discussion thread successfully updated.")
      render json: @discussion_thread.as_json(include: :tags)
    else
      Rails.logger.error("Failed to update discussion thread. Errors: #{@discussion_thread.errors.full_messages}")
      render json: @discussion_thread.errors, status: :unprocessable_entity
    end
  end

  def destroy
    unless authorized_to_modify?
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end

    @discussion_thread.destroy
  end

  def search
    query = params[:tag_name]

    if query.present?
      tag = Tag.find_by(name: query.downcase)

      if tag.present?
        discussion_thread_ids = Tagging.where(tag_id: tag.id).pluck(:discussion_thread_id)
        @discussion_threads = DiscussionThread.where(id: discussion_thread_ids)
        render json: @discussion_threads, include: :tags
      else
        render json: { message: 'Tag not found' }, status: :not_found
      end
    else
      render json: { message: 'Please provide a tag for search' }, status: :bad_request
    end
  end

  def fetch_my_threads
    @mythreads =  DiscussionThread.where(username: params[:username])
    render json: @mythreads, include: :tags
  end 

  private

  def authorized_to_modify?
    @discussion_thread.username == current_user.username
  end

  def set_discussion_thread
    @discussion_thread = DiscussionThread.find_by(id: params[:id])
  end

  def discussion_thread_params
    params.require(:discussion_thread).permit(:title, :content, :username, tag_names: [])
  end    

  def update_tags(new_tag_names)
    existing_tags = @discussion_thread.tags
  
    # Delete tags that are not present
    tags_to_delete = existing_tags.reject { |tag| new_tag_names.include?(tag.name) }
    tags_to_delete.each do |tag|
      tagging = Tagging.find_by(discussion_thread_id: @discussion_thread.id, tag_id: tag.id)
      tagging.destroy if tagging
    end
  
    # Create new tags that are not present 
    new_tag_names.each do |tag_name|
      tag = Tag.find_or_create_by(name: tag_name.downcase)
      tagging = Tagging.find_or_create_by(discussion_thread_id: @discussion_thread.id, tag_id: tag.id)
    end
  end
end


  