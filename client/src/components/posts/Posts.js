import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import PostForm from './PostForm';
const SearchInput = ({ onChange }) => {
  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    onChange(searchTerm);
  };

  return (
    <div style={styles.searchInput}>
    <input
      type="text"
      placeholder="Search"
      style={styles.input}
      onChange={handleInputChange}
    />
    <button style={styles.button} onClick={()=>{
      onChange('');
    }}>Clear</button>
  </div>
  
  );
};


const Posts = ({ getPosts, post: { posts, loading },typeofuser }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    // Perform search or filter logic based on the search term
    // For example, update the displayed data or make an API request
    const results = posts.filter((item) =>
    item?.text?.toLowerCase().includes(term.toLowerCase())
  );
   setSearchDisp(results)
  };
const [searchDisp, setSearchDisp] = useState([]);
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Our Courses</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community
      </p>
    
      <PostForm />
      <div>
      <h1>Search Example</h1>
      <SearchInput onChange={handleSearchChange}  />
      {/* Render other components and data based on the search term */}
    </div>
      <div className='posts'>
      {
        searchDisp.length>0?<>
         { searchDisp.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
        </>:<>
        { posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
        </> 
      
      }
       
      </div>

 
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
const styles = {
  searchInput: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  input: {
    flex: 1,
    padding: '4px',
    border: 'none',
    outline: 'none',
  },
  button: {
    marginLeft: '8px',
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
