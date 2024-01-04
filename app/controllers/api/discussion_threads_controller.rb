class Api::DiscussionThreadsController < ApplicationController
    before_action :set_thread, only: [:show, :update, :destroy]
    
    def index
      @threads = DiscussionThread.all
      render json: @threads
    end
    
    def show
      render json: @thread
    end
    
    def create
      @thread = DiscussionThread.new(thread_params)
      @thread.tags = Tag.where(id: params[:thread][:tag_ids])
    
      if @thread.save
        render json: @thread, status: :created, location: @thread
      else
        render json: @thread.errors, status: :unprocessable_entity
      end
    end
    
    def update
      @thread.tags = Tag.where(id: params[:thread][:tag_ids])

      if @thread.update(thread_params)
          render json: @thread
      else
        render json: @thread.errors, status: :unprocessable_entity
      end
    end
    
    def destroy
      @thread.destroy
    end
    
    private
    
    def set_thread
      @thread = DiscussionThread.find(params[:id])
    end
    
    def thread_params
      params.require(:thread).permit(:title, :content, tag_ids: [])
    end
end
  