import React, { useState } from "react";
import { useRouter } from 'next/router';
import { v1 as uuid } from "uuid";
import * as S from './styles';

export function CreateRoom () {
    const [groupName, setGroupName] = useState('');
    const router = useRouter();


    function joinOnMeet() {
        const id = uuid();
        router.push(`/room/${id}`);
    }

    return (
        <div>
            <S.Label>Nome do grupo</S.Label>
            <S.Input 
                value={groupName} 
                onChange={(e)=> setGroupName(e.target.value)}
                placeholder="Insira o nome do grupo"
            />
            <S.Button onClick={() => joinOnMeet()}>Entrar no Grupo</S.Button>
        </div>
    );
};

export default CreateRoom;
