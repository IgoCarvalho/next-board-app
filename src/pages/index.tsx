import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <div className={styles.heroImageContainer}>
          <Image
            src="/images/board-user.svg"
            alt="Ferramenta Board"
            width="553"
            height="384"
          />
        </div>
        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia Escreva, planeje e organize-se.</h1>
          <p>
            <span>100% Gratuita</span> e online.
          </p>
        </section>

        <section className={styles.donators}>
          <p>Apoiadores:</p>

          <ul>
            <li>
              <Image
                src="https://avatars.githubusercontent.com/u/42634011?v=4"
                alt="Imagem de apoiador"
                width={50}
                height={50}
              />
            </li>
            <li>
              <Image
                src="https://avatars.githubusercontent.com/u/42634011?v=4"
                alt="Imagem de apoiador"
                width={50}
                height={50}
              />
            </li>
            <li>
              <Image
                src="https://avatars.githubusercontent.com/u/67937973?v=4"
                alt="Imagem de apoiador"
                width={50}
                height={50}
              />
            </li>
            <li>
              <Image
                src="https://avatars.githubusercontent.com/u/42634011?v=4"
                alt="Imagem de apoiador"
                width={50}
                height={50}
              />
            </li>
            <li>
              <Image
                src="https://avatars.githubusercontent.com/u/42634011?v=4"
                alt="Imagem de apoiador"
                width={50}
                height={50}
              />
            </li>
            <li>
              <Image
                src="https://avatars.githubusercontent.com/u/42634011?v=4"
                alt="Imagem de apoiador"
                width={50}
                height={50}
              />
            </li>

          </ul>
        </section>
      </main>
    </>
  )
}

export default Home
