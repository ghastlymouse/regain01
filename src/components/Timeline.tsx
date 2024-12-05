import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./Tweet";
import { Unsubscribe } from "firebase/auth";

export type TweetType = {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
};

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const [tweets, setTweets] = useState<TweetType[]>([]);

  useEffect(() => {
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      // document를 받아옴
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return { id: doc.id, tweet, createdAt, userId, username, photo };
      // });

      // document를 한 번만 가져오는 대신 쿼리에 리스너 추가
      // db에 변동 사항이 있을 때 (추가, 삭제..) 실시간으로 document를 받아옴
      unsubscribeRef.current = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return { id: doc.id, tweet, createdAt, userId, username, photo };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
