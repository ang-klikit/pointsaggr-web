import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Shared layout shell: brand header + bottom tab bar on mobile, with a
 * centered max-width on larger screens. The claim funnel intentionally
 * hides the tab bar to keep the scan-in funnel clean.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const hideTabs = pathname.startsWith('/c/') || pathname === '/me/register';

  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col">
      <main className={['flex-1', hideTabs ? '' : 'pb-24'].join(' ')}>
        <Outlet />
      </main>
      {hideTabs ? null : <TabBar />}
    </div>
  );
}

function TabBar() {
  const { t } = useTranslation();
  const tabs = [
    { to: '/', label: t('nav.home'), icon: HomeIcon },
    { to: '/me/history', label: t('nav.history'), icon: HistoryIcon },
    { to: '/me/profile', label: t('nav.profile'), icon: ProfileIcon },
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-1/2 z-30 w-full max-w-xl -translate-x-1/2
        border-t border-ink/5 bg-canvas/95 backdrop-blur
        safe-bottom
      "
    >
      <ul className="grid grid-cols-3">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-1 py-2.5 text-xs font-medium',
                  isActive ? 'text-brand-500' : 'text-ink-muted hover:text-ink',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

type IconProps = { active: boolean };

function HomeIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-7.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.15 : 0}
      />
    </svg>
  );
}

function HistoryIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.15 : 0}
      />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="9"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.15 : 0}
      />
      <path
        d="M4.5 19.5c1.2-3.3 4.3-5 7.5-5s6.3 1.7 7.5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
