import Link from 'next/link'
import { SignInButton } from '../SignInButton'

import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer} >
      <div className={styles.headerContent}>
        <nav>
          <Link href="/">
            <img src="/images/logo.svg" alt="Meu Board Logo"/>
          </Link>

          <Link href="/">
            <a>Home</a>
          </Link>

          <Link href="/board">
            <a>Meu Board</a>
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
