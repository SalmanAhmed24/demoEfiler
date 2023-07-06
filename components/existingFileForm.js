import Select from "react-select";
import React, { useState } from "react";
import axios from "axios";
import "./existing.css";
import Swal from "sweetalert2";
function ExistingFileForm({ currentRole, wholeFiler, refresh }) {
  const [toRole, setToRole] = useState(currentRole);
  const [comment, setComment] = useState("");
  const [loaderNext, setLoaderNext] = useState(false);
  const [loaderPrev, setLoaderPrev] = useState(false);
  const [file, setFile] = useState({});
  const handlePrevState = () => {
    setLoaderPrev(true);
    axios
      .patch(
        `http://localhost:9000/api/fileStatus/editFileStatus/${wholeFiler.id}`,
        {
          toRole:
            currentRole == "second level"
              ? "first level"
              : currentRole == "fourth level"
              ? "third level"
              : currentRole == "third level"
              ? "second level"
              : "first level",
          role: currentRole,
          individualCom: comment,
          reject: true,
        }
      )
      .then((res) => {
        setLoaderPrev(false);
        refresh();

        console.log(res);
      })
      .catch((error) => console.log(error));
  };
  const handleNextState = () => {
    setLoaderNext(true);
    axios
      .patch(
        `http://localhost:9000/api/fileStatus/editFileStatus/${wholeFiler.id}`,
        {
          toRole:
            currentRole == "second level"
              ? "third level"
              : currentRole == "third level"
              ? "fourth level"
              : currentRole == "first level"
              ? "second level"
              : "first level",
          role: currentRole,
          individualCom: comment,
          reject: false,
        }
      )
      .then((res) => {
        setLoaderNext(false);
        refresh();
        console.log(res);
      })
      .catch((error) => console.log(error));
  };
  const allCom = [
    ...wholeFiler.step1.comments,
    ...wholeFiler.step2.comments,
    ...wholeFiler.step3.comments,
    ...wholeFiler.step4.comments,
  ];
  const currentRoleCom = allCom.filter((i) => i.role == currentRole);
  const handleFileView = (file) => {
    var byteCharacters = atob(file.buffer);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var fileNew = new Blob([byteArray], { type: "application/pdf;base64" });
    var fileURL = URL.createObjectURL(fileNew);
    window.open(fileURL);
  };
  const fileUploadHandler = (e) => {
    setFile(e.target.files[0]);
  };
  console.log("this is currentRoleCom", currentRoleCom);
  const handleSubmit = (e, id) => {
    e.preventDefault();
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to update a new document because the old one will be replaced.",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        var formData = new FormData();
        formData.append("file", file);
        axios({
          method: "patch",
          url: `http://localhost:9000/api/fileStatus/uploadNewFile/${id}`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            console.log("this is res", res);
            refresh();
          })
          .catch((error) => console.log(error));
      }
    });
  };
  const markAsDone = (id) => {
    Swal.fire({
      title: "Mark As Done",
      text: "Are you sure you want to mark the document as DONE",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Done",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: "patch",
          url: `http://localhost:9000/api/fileStatus/markAsDone/${id}`,
        })
          .then((res) => {
            console.log("this is res", res);
            Swal.fire({
              title: "Done",
              text: "The Document has marked as done.",
              icon: "success",
              showCancelButton: false,
              showConfirmButton: false,
            });
          })
          .catch((error) => console.log(error));
      }
    });
  };
  return (
    <div className="form-wrap">
      <h1 className="form-h1">{currentRole}</h1>
      <div className="viewWrap">
        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={(e) => handleSubmit(e, wholeFiler.id)}
        >
          <h3 style={{ marginBottom: 10 }}>Upload edited document</h3>
          <input
            type="file"
            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
text/plain, application/pdf, image/*"
            placeholder="upload updated file"
            onChange={(e) => fileUploadHandler(e)}
          />
          <input type="submit" class="subBtn" value="Upload" />
        </form>
        <button onClick={() => handleFileView(wholeFiler.uploadedFile)}>
          View Document
        </button>
      </div>
      <h3 className="form-h2">Comments</h3>
      <input value={comment} onChange={(e) => setComment(e.target.value)} />
      <div className="btn-wrap">
        {currentRole == "first level" ? null : loaderPrev ? (
          <p>Loading...</p>
        ) : (
          <button onClick={handlePrevState}>
            {currentRole == "second level"
              ? "Send to level one"
              : currentRole == "third level"
              ? "Send back to second level"
              : currentRole == "fourth level"
              ? "Send back to level 3"
              : ""}
          </button>
        )}
        {currentRole == "fourth level" ? (
          <button onClick={() => markAsDone(wholeFiler.id)}>
            Mark As Done
          </button>
        ) : loaderNext ? (
          <p>Loading....</p>
        ) : (
          <button onClick={handleNextState}>
            {currentRole == "second level"
              ? "Send to third level"
              : currentRole == "third level"
              ? "Send to fourth level"
              : currentRole == "first level"
              ? "Send to Second level"
              : ""}
          </button>
        )}
      </div>
      <div className="comment-wrap">
        <h3>{currentRole} comments</h3>
        {currentRoleCom.length ? (
          currentRoleCom.map((i, index) => (
            <div className="comments" key={i.id}>
              <p
                className="comment-p"
                style={i.reject == true ? { color: "red" } : { color: "green" }}
              >
                {i.comment}
              </p>
              <p className="comment-r">{i.role}</p>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <p>date :{i.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No Comments found</p>
        )}
      </div>
      <div className="prev-comments">
        <h3>History comments</h3>
        {wholeFiler.prevComments && wholeFiler.prevComments.length ? (
          wholeFiler.prevComments.map((i) =>
            i.comment == "" ? (
              <p key={i.id}>No Comments found</p>
            ) : (
              <div className="comments" key={i.id}>
                <p
                  className="comment-p"
                  style={
                    i.reject == true ? { color: "red" } : { color: "green" }
                  }
                >
                  {i.comment}
                </p>
                <p className="comment-r">
                  <strong>{i.role}</strong>
                </p>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <p>date :{i.date}</p>
                </div>
              </div>
            )
          )
        ) : (
          <p>No Comments found</p>
        )}
      </div>
    </div>
  );
}

export default ExistingFileForm;
