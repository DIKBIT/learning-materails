import React, { Fragment, useState, useCallback, useEffect, Button } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";
import { useDropzone } from "react-dropzone";
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { saveAs } from 'file-saver'

import FileUploadScreen from './FileUploadScreen';
  const FileUpload = ({setFileToBeSent, handleSubmit}) => {
    
  
    
  

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
      formData.append('file')
      setFileToBeSent(formData);
      formData.append('type', "save");

      handleSubmit(formData)
     //await addPost(selectedFile);
      // await axios.post('/api/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      console.log("formadata ", formData,   "========")
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  





  return (
  
      <div>
      <Dropzone  accept=".pdf,.doc,.docx">
        {/* {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {selectedFile ? (
              <div>Selected File: {selectedFile.name}</div>
            ) : (
              <div>Drag and drop files here or click to select files</div>
            )}
          </div>
        )} */}
      </Dropzone>
      {/* {selectedFile && (
        <button onClick={handleFileUpload}>Upload File</button>
      )} */}
    </div>

  
  );
};

const PostForm = ({ addPost }) => {
  const [text, setText] = useState("");
  const [fileToBeSent, setFileToBeSent] = useState(null);
  const [singleFile, setSingleFile] = useState('');
  const [multipleFiles, setMultipleFiles] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [singleFiles, setSingleFiles] = useState([]);

  const handleFileSelect = (files) => {
    setSelectedFile(files[0]);
  };

  const SingleFileChange = async (e) =>{
    setSingleFile(e.target.files[0]);
  
  }

  const MultipleFileChange=(e)=>{
    setMultipleFiles(e.target.files);
  }

  const handleSubmit = (formData)=>{
    addPost(formData);
  }
  const apiUrl = 'http://localhost:3000/api/';

 const singleFileUpload = async (data, options) => {
    try {
        await axios.post(apiUrl + 'singleFile', data, options);
    } catch (error) {
        throw error;
    }
}
useEffect(() => {
  getSingleFileslist();
}, []);

const getSingleFiles = async () => {
  try {
          const {data} = await axios.get(apiUrl + 'getSingleFiles');
          return data;
  } catch (error) {
      throw error;
  }
}
const getSingleFileslist = async () => {
  try {
      const fileslist = await getSingleFiles();
      setSingleFiles(fileslist);
  } catch (error) {
    console.log(error);
  }
}


  const uploadSingleFile = async () => {
    const formData = new FormData();
    formData.append('file', singleFile);
    await singleFileUpload(formData);
    //props.getsingle();

}


//   const uploadSingleFile = async(file)=>{
//     console.log(singleFile);
  
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
// try{
//   console.log("file")
//   const res = await axios.post(`/api/singleFile`, {file}, config);
// console.log("res is ", res);

// }catch(e){
// console.log("error is ", e);
// }

//   }

  const uploadMultipleFiles = async()=>{
    console.log(multipleFiles);


  }
  const downloadImage = (imageUrl) => {
    saveAs(imageUrl, 'image.jpg') // Put your image url here.
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

      {/* <FileUploadScreen getsingle={() => getSingleFileslist()} /> */}
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


      <div className="bg-primary p">
        <h3>Upload your study materials (Single or Multiple Files)</h3>
        <div>
          <label>Select Single File</label>
          <input type="file" onChange={(e)=> SingleFileChange(e)}></input>
          <button type="button" onClick={()=>uploadSingleFile()}>Upload12211</button>
        </div>


        <div>
          <label>Select Multiple Files</label>
          <input type="file" onChange={(e)=>MultipleFileChange(e)} multiple></input>
          <button type="button" onClick={()=> uploadMultipleFiles()}>Upload</button>
        </div>
        {/* <FileUpload setFileToBeSent={setFileToBeSent} 
        handleSubmit={handleSubmit}
        
        /> */}
      </div>
    </Fragment>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func,
};

export default connect(null, { addPost })(PostForm);
