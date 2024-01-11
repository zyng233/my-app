class Api::CommentsController < ApplicationController
    before_action :set_comment, only: [:show, :update, :destroy]
    before_action :authenticate_user!, only: [:create, :update, :destroy]

    def index
      @comments = Comment.all
      render json: @comments
    end
  
    def show
      render json: @comment
    end
  
    def create
      @comment = current_user.comments.new(comment_params)
      @comment.discussion_thread_id = params[:comment][:discussion_thread_id]
  
      if @comment.save
        render json: @comment, status: :created, location: @comment
      else
        render json: @comment.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @comment.update(comment_params)
        render json: @comment
      else
        render json: @comment.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @comment.destroy
    end
  
    private
  
    def set_comment
      @comment = Comment.find(params[:id])
    end
  
    def comment_params
      params.require(:comment).permit(:content, :thread_id)
    end
  end
  