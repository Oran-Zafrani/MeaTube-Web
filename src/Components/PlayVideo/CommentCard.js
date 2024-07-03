import React from 'react'
import { parseUploadTime } from '../Feed/VideoCard'

export const CommentCard = ({comment, index}) => {
  return (
      <div className='comment' key={index}>
          <img src={comment.userImage } alt='commenter' className="commenter-image" />
          <div>
              <h3>{comment.displayName} <span>{parseUploadTime(comment.timestamp)}</span></h3>
              <p>{comment.commentText}</p>
              <div className='comment-action'>
                  <i className="bi bi-hand-thumbs-up-fill"></i>
                  <span>{comment.likesNum}</span>
                  <i className="bi bi-hand-thumbs-down-fill"></i>
                  <span>{comment.dislikesNum}</span>
              </div>
          </div>
      </div>
  )
}
