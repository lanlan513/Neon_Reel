import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Atmosphere } from './Atmosphere.tsx';
import { SiteHeader } from './SiteHeader.tsx';
import { SiteFooter } from './SiteFooter.tsx';

/** App chrome: fixed projector atmosphere, sticky header, routed page, footer. */
export function Layout() {
  const { pathname } = useLocation();

  // Each route should start at the top of the film strip.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Atmosphere />
      <a className="skip-link" href="#main">
        跳到主要內容
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
