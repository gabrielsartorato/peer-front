import React, { useState } from "react";
import { useRouter } from 'next/router';
import * as S from './styles';
// import { v1 as uuid } from "uuid";

export function CreateRoom () {
    const [groupName, setGroupName] = useState('');
    const router = useRouter();


    function joinOnMeet() {
        if(!groupName) return;
        router.push(`/room/${groupName}`);
    }

    return (
        <S.Form>
            <S.Label>Nome do grupo</S.Label>
            <S.Input 
                value={groupName} 
                onChange={(e)=> setGroupName(e.target.value)}
                placeholder="Insira o nome do grupo"
            />
            <S.Button onClick={joinOnMeet}>Entrar no Grupo</S.Button>
        </S.Form>
    );
};

export default CreateRoom;
