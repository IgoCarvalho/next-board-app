import { useRouter } from 'next/router'
import { FaGithub } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'

import { signIn, signOut, useSession } from 'next-auth/react'

import styles from './styles.module.scss'

export function SignInButton() {
  const { data: session } = useSession()
  const router = useRouter()

  function doLogin() {
    const url = router.query.callbackUrl as string

    signIn('github', { callbackUrl: url })
  }

  function doLogOut() {
    signOut()
  }

  if (!session) {
    return (
      <button
        type="button"
        className={styles.signInButton}
        onClick={doLogin}
      >
        <FaGithub color={styles.secondaryColor} size={25} />
        Entrar com gitHub
      </button>
    )
  }

  return (
    <button
      type="button"
      className={styles.signInButton}
      onClick={doLogOut}
    >
      <img
        src="https://avatars.githubusercontent.com/u/42634011?v=4"
        alt="User profile"
      />
      Olá { session.user?.name }
      <MdLogout color={styles.greyColor} size={25} />
    </button>
  )
}
