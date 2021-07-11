import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { dbService, storageService } from "../firebase";

export default function Twit({ twitObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newTwit, setNewTwit] = useState(twitObj.text);

  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this twit?");
    if (ok) {
      await dbService.doc(`twits/${twitObj.id}`).delete();
      await storageService.refFromURL(twitObj.uploadedFileURL).delete();
    }
  }

  const toggleEditing = () => {
    setEditing(prev => !prev);
  }

  const onEdit = (e) => {
    e.preventDefault();
    dbService.doc(`twits/${twitObj.id}`).update({
      text: newTwit
    })
    toggleEditing();
  }
  return (
    <div className="nweet">
      {
        editing ? <>
          <form onSubmit={onEdit} className="container nweetEdit">
            <input className="formInput" type="text" value={newTwit} onChange={(e) => setNewTwit(e.target.value)} required autoFocus />
            <input className="formBtn" type="submit" value="Edit Twit" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </> : <>
          <h4>{twitObj.text}</h4>
          {
            twitObj.uploadedFileURL && <img src={twitObj.uploadedFileURL} alt={twitObj.uploadedFileURL} />
          }
          {
            isOwner && <div class="nweet__actions">
              <span onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          }
        </>
      }
    </div>
  )
}