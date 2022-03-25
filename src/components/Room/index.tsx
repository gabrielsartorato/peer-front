import React, { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import * as S from './styles';
import Peer from "simple-peer";
import { useRouter } from 'next/router';
import { FaMicrophone, FaVideo } from 'react-icons/fa';

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <S.StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: 240,
    width: 480,
};

const Actions = () => {
    return (
        <>
        <S.IconButton>
            <FaMicrophone size={24} />
        </S.IconButton>
        <S.IconButton>
            <FaVideo size={24} />
        </S.IconButton>
        <S.IconButton>
            <FaMicrophone size={24} />
        </S.IconButton>
        </>
    )
}

export function Room(props){
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);

    const router = useRouter();

    // const { roomID } = router.query;
    const roomID = '6caa2869-1cf6-48a7-b6bd-0354c13b6ae1';
    
    console.log('peers', peers);

    const socket = useMemo(
        () => io.connect('https://f4f4-201-69-118-20.ngrok.io'),
        []
      );

    useEffect(() => {

        if(!roomID) return;

        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socket.emit("join room", roomID);
            socket.on("all users", users => {
                const peersList = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socket.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peersList.push(peer);
                })
                setPeers(peersList);
            })

            socket.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socket.on("receiving returned signal", payload => {
                console.log("the paylod", payload);
                console.log("the peersss refff ", peersRef.current);
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })

        
    }, []);

    

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socket.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <S.Container>
            <S.StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
            <Actions />
        </S.Container>
    );
}