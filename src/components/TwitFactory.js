import { useState } from "react";
import { dbService, storageService } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function TwitFactory({ userObj }) {
  const [twit, setTwit] = useState("");
  const [fileURL, setFileURL] = useState("");
  const onSubmit = async e => {
    if (twit === "") {
      return;
    }
    e.preventDefault();
    let uploadedFileURL = "";
    if (fileURL !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const res = await fileRef.putString(fileURL, "data_url");
      uploadedFileURL = await res.ref.getDownloadURL();
    }
    await dbService.collection("twits").add({
      text: twit,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      uploadedFileURL,
    });
    console.log(uploadedFileURL)
    setTwit("");
    setFileURL("");
  }

  const onChange = (e) => {
    setTwit(e.target.value);
  }

  const onFileChange = e => {
    const { target: { files } } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      setFileURL(finishedEvent.currentTarget.result)
    }
    reader.readAsDataURL(theFile);
  }
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={twit}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {
        fileURL && <div className="factoryForm__attachment">
          <img src={fileURL} alt={fileURL} style={{ backgroundImage: fileURL }} />
          <div className="factoryForm__clear" onClick={() => setFileURL("")}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      }
    </form>
  )
}