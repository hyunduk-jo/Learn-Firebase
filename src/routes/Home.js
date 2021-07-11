import { useEffect, useState } from "react";
import Twit from "../components/Twit";
import { dbService } from "../firebase";
import TwitFactory from "../components/TwitFactory";

export default function Home({ userObj }) {
  const [twits, setTwits] = useState([]);

  useEffect(() => {
    dbService.collection("twits").onSnapshot(snapshot => {
      const twitArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTwits(twitArray)
    })
  }, [])

  return (
    <div className="container">
      <TwitFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {
          twits.map(twit => <Twit key={twit.id} twitObj={twit} isOwner={twit.creatorId === userObj.uid} />)
        }
      </div>
    </div>
  )
}