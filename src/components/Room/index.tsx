import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import * as S from "./styles";
import Peer from "simple-peer";
import { useRouter } from "next/router";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import defaultImage from "../../../public/avatar/default-1.png";
import Image from "next/image";

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      console.log(stream);
      ref.current.srcObject = stream;
    });
  }, [props.peer]);

  return (
    <S.UserCard>
      <S.StyledVideo playsInline autoPlay ref={ref} hidden />
      <Image src={defaultImage} alt={props.name} width={150} height={150} />
      <p>{props.name}</p>
    </S.UserCard>
  );
};

const videoConstraints = {
  height: 240,
  width: 480,
};

export function Room(props) {
  const [peers, setPeers] = useState([]);
  const [audioState, setAudioState] = useState(true);
  const socketRef = useRef();
  // const [userStream, setUserStream] = useState(null);
  const userVideo = useRef();
  const peersRef = useRef([]);

  const router = useRouter();
  let userStream;

  const { roomID: room_id, userName } = router.query;
  const roomID = room_id;

  const socket = useMemo(() => io("http://localhost:8000/"), []);

  const createPeer = useCallback(
    (userToSignal, callerID, stream, name) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("sending signal", {
          userToSignal,
          callerID,
          signal,
          name,
        });
      });

      return peer;
    },
    [socket]
  );

  const addPeer = useCallback(
    (incomingSignal, callerID, stream, name) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("returning signal", { signal, callerID, name });
      });

      peer.signal(incomingSignal);

      return peer;
    },
    [socket]
  );

  useEffect(() => {
    // socketRef.current = io.connect("http://localhost:8000/");
    if (!roomID) return;
    socket.on("connect", () => {
      socket.emit("join room", {
        roomID,
        name: userName,
      });
    });

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      userVideo.current.srcObject = stream;

      socket.on("all users", (users) => {
        const peersList = [];
        users.forEach((user) => {
          const peer = createPeer(user.id, socket.id, stream, userName);
          peersRef.current.push({
            peerID: user.id,
            name: user.name,
            peer,
          });
          peersList.push({
            peerID: user.id,
            name: user.name,
            peer,
          });
        });
        setPeers(peersList);
      });

      socket.on("user joined", (payload) => {
        const peer = addPeer(
          payload.signal,
          payload.callerID,
          stream,
          payload.name
        );
        peersRef.current.push({
          peerID: payload.callerID,
          name: payload.name,
          peer,
        });

        const peerObj = {
          peer,
          peerID: payload.callerID,
          name: payload.name,
        };
        setPeers((users) => [...users, peerObj]);
      });

      socket.on("receiving returned signal", (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });

      socket.on("user left", (id) => {
        const peerObj = peersRef.current.find((p) => p.peerID === id);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        const peers = peersRef.current.filter((p) => p.peerID !== id);
        peersRef.current = peers;
        setPeers(peers);
      });
    });
  }, [addPeer, createPeer, roomID, socket, userName]);

  return (
    <S.Content>
      <S.Container>
        <S.VideoArea>
          <S.UserCard>
            <S.StyledVideo muted ref={userVideo} autoPlay playsInline hidden />
            <Image src={defaultImage} width={150} height={150} alt="userName" />
          </S.UserCard>

          {peers.map((peer) => {
            return (
              <Video key={peer.peerID} peer={peer.peer} name={peer.name} />
            );
          })}
        </S.VideoArea>
      </S.Container>
      <S.Actions>
        <S.IconButton
          onClick={() => {
            const audioTrack = userVideo.current.srcObject
              .getTracks()
              .find((track) => track.kind === "audio");
            if (audioTrack.enabled) {
              audioTrack.enabled = false;
              setAudioState(false);
            } else {
              audioTrack.enabled = true;
              setAudioState(true);
            }
          }}
        >
          {audioState ? (
            <FaMicrophone size={24} />
          ) : (
            <FaMicrophoneSlash size={24} />
          )}
        </S.IconButton>
        {/* <S.IconButton>
          <FaEllipsisV size={24} />
        </S.IconButton> */}
      </S.Actions>
    </S.Content>
  );
}
