// @ts-nocheck
import React, { useState } from "react";
import { useRouter } from "next/router";
import { v1 as uuid } from "uuid";
import * as S from "./styles";
import { getSession, signOut } from "next-auth/react";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
interface UserLoggedin {
  user: any;
}

export function CreateRoom({ user }: UserLoggedin) {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState<string>();
  const router = useRouter();

  function createMeet() {
    const id = uuid();
    router.push({
      pathname: `/room/${id}`,
    });
  }

  function joinOnMeet() {
    router.push({
      pathname: `/room/${roomId}`,
    });
  }

  return (
    <S.Column>
      <S.Avatar>
        <Image
          src={user?.image || "/avatar/default-1.png"}
          alt={user?.name}
          width={200}
          height={200}
        />
      </S.Avatar>
      <S.Row>
        <h3>{user?.name}</h3>
        <S.Logout>
          <FaSignOutAlt onClick={() => signOut()} />
        </S.Logout>
      </S.Row>
      <S.Row>
        <S.Button
          onClick={() => createMeet()}
          disabled={
            user?.name === undefined || user?.name === "" ? true : false
          }
          locked={user?.name === undefined || user?.name === "" ? true : false}
        >
          Criar Sala
        </S.Button>
      </S.Row>
    </S.Column>
  );
}

export default CreateRoom;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    return {};
  }
  return {
    props: {
      user: session.user,
    },
  };
}
