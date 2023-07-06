import Select from "react-select";
import React, { useState } from "react";
import axios from "axios";
import "./existing.css";
function AddInitialForm({ refresh }) {
  const [toRole, setToRole] = useState("second level");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData();
    formData.append("individualCom", comment);
    formData.append("role", "first level");
    formData.append("toRole", toRole);
    formData.append("file", file);
    axios({
      method: "post",
      url: "http://localhost:9000/api/fileStatus/addEFile",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        refresh();
        console.log(res);
      })
      .catch((error) => console.log(error));
  };
  const fileHandler = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="form-wrap">
      <h1 className="form-h1">First Level</h1>
      <h3 className="form-h2">Comments</h3>
      <form
        className="formNew"
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <input
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          name="file"
          type="file"
          onChange={fileHandler}
          placeholder="Upload File"
        />
        <input
          type="submit"
          className="newBtn"
          value={"Send To Second Person"}
        />
      </form>
    </div>
  );
}

export default AddInitialForm;
