// @ts-nocheck
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { v1 as uuid } from 'uuid';
import * as S from './styles';

export function CreateRoom() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState<string>();
  const router = useRouter();

  function createMeet() {
    const id = uuid();
    router.push({
      pathname: `/room/${id}`,
      query: {
        userName,
      },
    });
  }

  function joinOnMeet() {
    router.push({
      pathname: `/room/${roomId}`,
      query: {
        userName,
      },
    });
  }

  return (
    <div>
      <S.Row>
        <S.Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Insira seu nome"
        />
        <S.Button
          onClick={() => createMeet()}
          disabled={userName === undefined || userName === '' ? true : false}
          locked={userName === undefined || userName === '' ? true : false}
        >
          Criar Sala
        </S.Button>
      </S.Row>
    </div>
  );
}

export default CreateRoom;
