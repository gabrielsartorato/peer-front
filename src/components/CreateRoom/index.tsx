import React, { useState } from "react";
import { useRouter } from "next/router";
import { v1 as uuid } from "uuid";
import * as S from "./styles";

export function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
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
      <S.Label>Insira seu nome</S.Label>
      <S.Input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Insira seu nome"
      />
      <S.Label>ID da sala</S.Label>
      <S.Input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Insira o ID da sala"
      />
      <S.Button onClick={() => joinOnMeet()}>Entrar na Sala</S.Button>
      <S.Button onClick={() => createMeet()}>Criar Sala</S.Button>
    </div>
  );
}

export default CreateRoom;
