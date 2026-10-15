import { NavLink } from 'react-router-dom';
import { RandomMovieButton } from './RandomMovieButton.tsx';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__grid">
          <div className="stack" style={{ gap: '0.9rem' }}>
            <span className="u-sign" style={{ fontSize: '1.35rem', color: '#fff' }}>
              Neon Reel
            </span>
            <p className="site-footer__note">
              一個以霓虹與膠片質感為靈感的香港電影探索站。目前收錄的是 1960–2010
              年代間的精選樣本，並非完整片目，內容僅作展示用途。
            </p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>探索 Explore</h4>
              <ul>
                <li>
                  <NavLink to="/">首頁</NavLink>
                </li>
                <li>
                  <NavLink to="/movies">片庫</NavLink>
                </li>
                <li>
                  <RandomMovieButton className="btn btn--quiet" style={{ padding: 0, letterSpacing: '0.16em' }}>
                    隨機抽一部
                  </RandomMovieButton>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>技術 Stack</h4>
              <ul>
                <li>React · TypeScript · Vite</li>
                <li>Node · Express · SQLite</li>
                <li>REST API · 單頁應用</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer__base">
          <span>© {new Date().getFullYear()} Neon Reel · 香港電影文化探索</span>
          <span>Curated sample · not an official archive</span>
        </div>
      </div>
    </footer>
  );
}
