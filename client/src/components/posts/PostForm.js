import React, { Fragment, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";
import { useDropzone } from "react-dropzone";
import Dropzone from 'react-dropzone';

  const FileUpload = ({setFileToBeSent, handleSubmit}) => {
    const [selectedFile, setSelectedFile] = useState(null);
  
    const handleFileSelect = (files) => {
      setSelectedFile(files[0]);
    };
  

  const [fileName, setFileName] = useState(null);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");

      reader.onerror = () => console.log("file reading has failed");

      reader.onload = () => {
        const binaryStr = reader.result;
        // console.log(binaryStr.name)

        // setFileName(binaryStr[0].name)

        // console.log(binaryStr[0].name, "printing the name of the file")
      };

      reader.readAsArrayBuffer(file);
    });
    console.log(acceptedFiles);
    console.log(acceptedFiles[0].name);
    setFileName(acceptedFiles?.[0]?.name);
    
    // here uyou have to set the file using setFileToBeSent this function
    //setFileToBeSent()
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = async () => {
    console.log("fuck")
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setFileToBeSent(formData);
      formData.append('type', "save");

      handleSubmit(formData)
     //await addPost(selectedFile);
      // await axios.post('/api/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      console.log("formadata ", formData,   "========", selectedFile)
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };





  return (
  
      <div>
      <Dropzone onDrop={handleFileSelect} accept=".pdf,.doc,.docx">
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {selectedFile ? (
              <div>Selected File: {selectedFile.name}</div>
            ) : (
              <div>Drag and drop files here or click to select files</div>
            )}
          </div>
        )}
      </Dropzone>
      {selectedFile && (
        <button onClick={handleFileUpload}>Upload File</button>
      )}
    </div>

  
  );
};

const PostForm = ({ addPost }) => {
  const [text, setText] = useState("");
  const [fileToBeSent, setFileToBeSent] = useState(null);

  const handleSubmit = (formData)=>{
    addPost(formData);
  }
  return (
    <Fragment>
      <div className="bg-primary p">
        <h3>Create Your own course</h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("text is ", text);
          addPost({ text , file: fileToBeSent});
          setText("");
        }}
        className="form my-1"
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create your course"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>

      <div className="bg-primary p">
        <h3>Upload your study materials</h3>
        <FileUpload setFileToBeSent={setFileToBeSent} 
        handleSubmit={handleSubmit}
        
        />
      </div>
    </Fragment>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func,
};

export default connect(null, { addPost })(PostForm);
