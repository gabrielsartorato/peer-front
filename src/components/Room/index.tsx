import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as S from './styles';
import Peer from "simple-peer";
import { useRouter } from 'next/router';

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

export function Room(props){
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);

    const router = useRouter();
    const { roomID } = router.query;


    useEffect(() => {
        if(!roomID) return;

        try {
            const socket = io('http://localhost:8000');
            socket.emit("join room", roomID);
            socketRef.current = socket;
            console.log('a');
            navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
                userVideo.current.srcObject = stream;
                socketRef.current.emit("join room", roomID);
                socketRef.current.on("all users", users => {
                    const peers = [];
                    users.forEach(userID => {
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        peers.push(peer);
                    })
                    setPeers(peers);
                })
    
                socketRef.current.on("user joined", payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
    
                    setPeers(users => [...users, peer]);
                });
    
                socketRef.current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });

                console.log("fim");
            })
        } catch (e){
            console.log("eee", e);
        }
        
    }, [roomID]);

    

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
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
            socketRef.current.emit("returning signal", { signal, callerID })
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
        </S.Container>
    );
}