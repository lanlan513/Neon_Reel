import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  isActive ? 'nav__link is-active' : 'nav__link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <NavLink to="/" className="brand" aria-label="Neon Reel 首頁">
          <img className="brand__mark" src="/favicon.svg" alt="" width={38} height={38} />
          <span>
            <span className="brand__text">Neon Reel</span>
            <span className="brand__sub">霓虹光影裡的香港電影</span>
          </span>
        </NavLink>

        <nav className="nav" aria-label="主導航">
          <NavLink to="/" end className={linkClass}>
            首頁 Home
          </NavLink>
          <NavLink to="/movies" className={linkClass}>
            片庫 Archive
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
