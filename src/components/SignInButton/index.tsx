import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'

import styles from './styles.module.scss'

export function SignInButton() {
  const isLoggedIn = true

  if (isLoggedIn) {
    return (
      <button type="button" className={styles.signInButton}>
        <img
          src="https://avatars.githubusercontent.com/u/42634011?v=4"
          alt="User profile"
        />
        Olá Igo
        <MdLogout color={styles.greyColor} size={25} />
      </button>
    )
  }

  return (
    <button type="button" className={styles.signInButton}>
      <FaGithub color={styles.secondaryColor} size={25} />
      Entrar com gitHub
    </button>
  )
}
