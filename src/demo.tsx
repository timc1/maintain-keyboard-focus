import React from 'react'
import './demo.css'

import useControlledFocus from './use-controlled-focus'

export default function Demo() {
  return (
    <>
      <Header />
    </>
  )
}

function Header() {
  const [isMenuOpen, toggleMenu] = React.useState(false)
  const toggler = React.useRef<HTMLButtonElement | null>(null)
  const firstLink = React.useRef<HTMLAnchorElement | null>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('e.key', e.key)
      if (e.key === `Escape`) {
        toggleMenu(state => !state)
        if (toggler.current) toggler.current.focus()
      }
    }

    if (isMenuOpen) {
      if (firstLink.current) firstLink.current.focus()

      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (isMenuOpen) {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isMenuOpen])

  const dropdown = React.useRef<HTMLUListElement>(null)
  useControlledFocus({
    container: dropdown,
    isOpen: isMenuOpen,
  })

  return (
    <header>
      <nav>
        <h1 className="logo">
          <a href="/">
            <span role="img" aria-label="Hand Wave Emoji">
              👋
            </span>{' '}
            Logo
          </a>
        </h1>
        <ul className="nav-items">
          <li>
            <a href="/">About</a>
          </li>
          <li>
            <a href="/">Team</a>
          </li>
          <li>
            <a href="/">Product</a>
          </li>
          <li>
            <a href="/">Careers</a>
          </li>
          <li>
            <button
              ref={toggler}
              className={`menu-btn${isMenuOpen ? ' menu-btn--open' : ''}`}
              onClick={() => toggleMenu(state => !state)}
            >
              <h2>Menu</h2>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42">
                <path d="M42 20H22V0h-2v20H0v2h20v20h2V22h20z" />
              </svg>
            </button>
            <ul
              ref={dropdown}
              className={`dropdown-menu${
                isMenuOpen ? ' dropdown-menu--open' : ''
              }`}
            >
              <li>
                <a href="/" ref={firstLink}>
                  Profile
                </a>
              </li>
              <li>
                <a href="/">Explore</a>
              </li>
              <li>
                <a href="/">Settings</a>
              </li>
              <li>
                <a href="/">Log out</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  )
}
