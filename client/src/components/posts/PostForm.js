import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  Button,
} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

import axios from "axios";
import { saveAs } from "file-saver";

const PostForm = ({ addPost }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [grade, setGrade] = useState("");

  const [singleFile, setSingleFile] = useState("");
  const [singleFiles, setSingleFiles] = useState([]);

  const singleFileChange = async (e) => {
    setSingleFile(e.target.files[0]);
  };
  const apiUrl = "http://localhost:3000/api/";

  const singleFileUpload = async (data, options) => {
    try {
      await axios.post(apiUrl + "singleFile", data, options);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    getSingleFileslist();
  }, []);

  const getSingleFiles = async () => {
    try {
      const { data } = await axios.get(apiUrl + "getSingleFiles");
      return data;
    } catch (error) {
      throw error;
    }
  };
  const getSingleFileslist = async () => {
    try {
      const fileslist = await getSingleFiles();
      setSingleFiles(fileslist);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadSingleFile = async (text) => {
    const formData = new FormData();
    formData.append("grade", grade);
    formData.append("category", category);
    formData.append("file", singleFile);
    formData.append("text", text);
    console.log("ormdata is ", formData);

    if (formData) {
      await singleFileUpload(formData);
    } else {
      console.log("add files to upload  ");
    }
    //props.getsingle();
  }
    const downloadImage = (imageUrl) => {
      saveAs(imageUrl, "image.jpg"); // Put your image url here.
    };
    return (
      <Fragment>
        <div className="bg-primary p">
          <h3>Create Your own course</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addPost({ text });
            setText("");
           setGrade("");
           setCategory("");
            uploadSingleFile(text);
          }}
          className="form my-1"
        >
          <textarea
            name="text"
            cols="5"
            rows="2"
            placeholder="Enter category"
            value={category}
            onChange={(e) =>setCategory( e.target.value)}
            required
          ></textarea>
          <textarea
            name="text"
            cols="4"
            rows="2"
            placeholder="Grade"
            value={grade}
            onChange={(e) =>{setGrade(e.target.value)}}
            required
          ></textarea>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Write a small desciption for the study material"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
          <div>
            <input type="file" onChange={(e) => singleFileChange(e)}></input>
          </div>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
        <div className="row">
        {singleFiles.map((file, index) => 
                  <div className="col-6">
                    <div >
                      <img src={`http://localhost:8000/${file.filePath}`} style={{height: 150, width: 150}}  alt="img"/>
                      <button onClick={()=>{
                        downloadImage(`http://localhost:8000/${file.filePath}`)
                      }}>Download!</button>

                      </div>
                  </div>
                )}
        </div>
      </Fragment>
    );
  };

  PostForm.propTypes = {
    addPost: PropTypes.func,
  };
export default connect(null, { addPost })(PostForm);
