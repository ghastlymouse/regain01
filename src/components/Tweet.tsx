import styled from "styled-components";
import { TweetType } from "./Timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Row = styled.div`
  display: flex;
  gap: 5px;
`;

const Column = styled.div``;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

// const CreatedAt = styled.p``;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: green;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: gray;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  border: 2px solid #1d9bf0;
  border-radius: 5px;
  font-size: 16px;
  background-color: black;
  color: white;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
}: TweetType) {
  const user = auth.currentUser;
  const [editmode, setEditmode] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (user?.uid !== userId || !ok) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };

  const onEdit = async () => {
    const user = auth.currentUser;
    if (user?.uid !== userId) return;
    try {
      const document = doc(db, "tweets", id);
      await updateDoc(document, {
        tweet: newTweet,
        createdAt: Date.now(),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setEditmode(false);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>
          {editmode ? (
            <TextArea
              placeholder={tweet}
              value={newTweet}
              onChange={onChange}
            />
          ) : (
            tweet
          )}
        </Payload>
        {user?.uid === userId ? (
          <Row>
            {editmode ? (
              <>
                {" "}
                <EditButton onClick={onEdit}>Edit</EditButton>
                <CancelButton
                  onClick={() => {
                    setEditmode(false);
                    setNewTweet(tweet);
                  }}
                >
                  cancel
                </CancelButton>
              </>
            ) : (
              <>
                {" "}
                <EditButton onClick={() => setEditmode(true)}>Edit</EditButton>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              </>
            )}
          </Row>
        ) : null}
      </Column>
      {photo ? <Photo src={photo} /> : null}
    </Wrapper>
  );
}
