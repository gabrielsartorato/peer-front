// @ts-nocheck
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
import { FaMicrophone, FaMicrophoneSlash, FaPhone } from "react-icons/fa";
import defaultImage from "../../../public/avatar/default-1.png";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Video = (props) => {
  const [microphone, setMicrophone] = useState(false);
  const ref = useRef();

  const audioContext = useRef(new AudioContext());

  const audio = audioContext.current;

  useEffect(() => {
    let scriptProcessor;

    props.peer.on("stream", (stream) => {
      audio.resume().then(() => {
        const micro = audio.createMediaStreamSource(stream);
        const analyser = audio.createAnalyser();
        scriptProcessor = audio.createScriptProcessor(2048, 1, 1);
        ref.current.srcObject = stream;

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        micro.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audio.destination);
        scriptProcessor.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          setMicrophone(Math.round(average) > 5);
        };
      });
    });

    return () => {
      scriptProcessor.disconnect();
      setMicrophone(false);
    };
  }, [audio, props.peer]);

  return (
    <S.UserCard microphone={microphone}>
      <S.StyledVideo playsInline autoPlay ref={ref} hidden />
      <Image
        src={props.avatar || defaultImage}
        alt={props.name}
        width={150}
        height={150}
      />
      <p>{props.name}</p>
    </S.UserCard>
  );
};

export function Room() {
  const { data: session } = useSession();
  const [peers, setPeers] = useState([]);
  const [audioState, setAudioState] = useState(true);
  const [microphone, setMicrophone] = useState(false);

  const userVideo = useRef();
  const peersRef = useRef([]);
  const audioContext = useRef(new AudioContext());

  const audio = audioContext.current;

  const router = useRouter();

  const { roomID: room_id } = router.query;
  const roomID = room_id;

  const socket = useMemo(
    () => io("https://strawberry-pudding-43161.herokuapp.com/"),
    []
  );

  // const socket = useMemo(() => io("http://localhost:8000/"), []);

  const disconnectRoom = () => {
    socket.disconnect();
    router.push("/");
  };

  const createPeer = useCallback(
    (userToSignal, callerID, stream, name, avatar) => {
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
          avatar,
        });
      });

      return peer;
    },
    [socket]
  );

  const addPeer = useCallback(
    (incomingSignal, callerID, stream, name, avatar) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("returning signal", { signal, callerID, name, avatar });
      });

      peer.signal(incomingSignal);

      return peer;
    },
    [socket]
  );

  useEffect(() => {
    if (!roomID) return;
    socket.on("connect", () => {
      socket.emit("join room", {
        roomID,
        name: session?.user?.name,
        avatar: session?.user?.image,
      });
    });

    let scriptProcessor;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audio.resume().then(() => {
        const micro = audio.createMediaStreamSource(stream);
        const analyser = audio.createAnalyser();
        scriptProcessor = audio.createScriptProcessor(2048, 1, 1);
        userVideo.current.srcObject = stream;

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        micro.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audio.destination);
        scriptProcessor.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          setMicrophone(Math.round(average) > 5);
        };
      });

      socket.on("all users", (users) => {
        const peersList = [];
        users.forEach((user) => {
          const peer = createPeer(
            user.id,
            socket.id,
            stream,
            session?.user?.name,
            session?.user?.image
          );
          peersRef.current.push({
            peerID: user.id,
            name: user.name,
            peer,
            avatar: user.avatar,
          });
          peersList.push({
            peerID: user.id,
            name: user.name,
            peer,
            avatar: user.avatar,
          });
        });
        setPeers(peersList);
      });

      socket.on("user joined", (payload) => {
        const peer = addPeer(
          payload.signal,
          payload.callerID,
          stream,
          payload.name,
          payload.avatar
        );
        peersRef.current.push({
          peerID: payload.callerID,
          name: payload.name,
          peer,
          avatar: payload.avatar,
        });

        const peerObj = {
          peer,
          peerID: payload.callerID,
          name: payload.name,
          avatar: payload.avatar,
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

    return () => {
      scriptProcessor.disconnect();
      setMicrophone(false);
    };
  }, [
    addPeer,
    createPeer,
    roomID,
    socket,
    session?.user?.name,
    session?.user?.image,
    audio,
  ]);

  return (
    <S.Content>
      <S.Container>
        <S.VideoArea>
          <S.UserCard microphone={microphone}>
            <S.StyledVideo muted ref={userVideo} autoPlay playsInline hidden />
            <Image
              src={session.user?.image}
              width={150}
              height={150}
              alt="userName"
            />
            <p>{session?.user?.name}</p>
          </S.UserCard>

          {peers.map((peer) => {
            return (
              <Video
                key={peer.peerID}
                peer={peer.peer}
                name={peer.name}
                avatar={peer.avatar}
              />
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
        <S.IconButton onClick={disconnectRoom} style={{ background: "red" }}>
          <FaPhone style={{ color: "#fff" }} size={24} />
        </S.IconButton>
      </S.Actions>
    </S.Content>
  );
}
