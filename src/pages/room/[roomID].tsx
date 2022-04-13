import type { NextPage } from "next";
import { Room as RoomComponent } from "../../components/Room";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import styles from "../../styles/Home.module.css";
import { FaSignInAlt } from "react-icons/fa";

const Room: NextPage = () => {
  const { data: session, status } = useSession();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {!session && (
          <button
            className={styles.primaryButtonAuth0}
            onClick={() => signIn("auth0")}
          >
            <div className={styles.divRow}>
              <h4>Escolha uma conta para continuar</h4>
            </div>
          </button>
        )}
        {session && <RoomComponent />}
      </main>
    </div>
  );
};

export default Room;
