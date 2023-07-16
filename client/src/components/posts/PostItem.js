import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import { saveAs } from "file-saver";

const PostItem = ({
  auth,
  addLike,
  removeLike,
  deletePost,
  post: { _id, text, name, avatar, user, likes, comments, date,status , category="", grade="",filePath=""},
  showActions,
}) => {
  const downloadImage = (imageUrl) => {
    saveAs(imageUrl, "image.jpg"); // Put your image url here.
  };
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <button
              onClick={(e) => addLike(_id)}
              type='button'
              className='btn btn-light'>
              
              Enroll yourself
            </button>
            <button>
            {likes.length > 0 && <span>{likes.length}</span>}

            </button>


            <button
              onClick={(e) => removeLike(_id)}
              type='button'
              className='btn btn-light'>
              Unenroll yourself
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button
                onClick={(e) => deletePost(_id)}
                type='button'
                className='btn btn-danger'>
                <i className='fas fa-times'></i>
              </button>
            )}
          </Fragment>
        )}
        <div>
          <h4>category</h4>
          <button
              type='button'
              className='btn btn-light'>
              {category}
             
            </button>
        </div>

        <div>
          <h4>grade</h4>
          <button
              type='button'
              className='btn btn-light'>
              {grade}
             
            </button>
        </div>
        <div className="col-6">
                 {
                  filePath?  <div >
                  <img src={`https://na-front-end-deploy--golden-sunflower-87d18e.netlify.app/${filePath}`} style={{height: 150, width: 150}}  alt="img"/>
                  <button onClick={()=>{
                    downloadImage(`https://na-front-end-deploy--golden-sunflower-87d18e.netlify.app/${filePath}`)
                  }}>Download!</button>

                  </div>:null
                 }
                  
                  </div>
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  addLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
});
export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
