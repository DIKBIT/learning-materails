import React, { Fragment, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({ setFileToBeSent }) => {
  const [fileName, setFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop files here, or click to select files</p>
      )}
      <h3>{fileName}</h3>
    </div>
  );
};

const PostForm = ({ addPost }) => {
  const [text, setText] = useState("");
  const [fileToBeSent, setFileToBeSent] = useState(null);
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
        <FileUpload setFileToBeSent={setFileToBeSent} />
      </div>
    </Fragment>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func,
};

export default connect(null, { addPost })(PostForm);
