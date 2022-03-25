import React, { useState } from "react";
import { useRouter } from 'next/router';
// import { v1 as uuid } from "uuid";

export function CreateRoom () {
    const [groupName, setGroupName] = useState('');
    const router = useRouter();


    function joinOnMeet() {
        if(!groupName) return;
        router.push(`/room/${groupName}`);
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <input style={{}} value={groupName} onChange={(e)=> setGroupName(e.target.value)}></input>
            <button onClick={joinOnMeet}>Entrar no Grupo!</button>
        </form>
    );
};

export default CreateRoom;
