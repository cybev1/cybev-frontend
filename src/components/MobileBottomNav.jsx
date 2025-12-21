import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { TrendingUp, FileText, Sparkles, Bell, User } from 'lucide-react';

/**
 * Mobile-first bottom navigation.
 * - Large tap targets
 * - Safe-area padding for iOS
 * - Optimized for mobile WebView shells (Capacitor/Cordova/React Native WebView)
 */
export default function MobileBottomNav() {
  const router = useRouter();
  const [profileHref, setProfileHref] = useState('/dashboard');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return;
      const u = JSON.parse(raw);
      const username = u?.username || u?.handle || u?.name;
      if (username) setProfileHref(`/profile/${encodeURIComponent(username)}`);
    } catch {
      // ignore
    }
  }, []);

  const pathname = useMemo(() => router.pathname || '', [router.pathname]);
  const asPath = useMemo(() => router.asPath || '', [router.asPath]);

  const isActive = (key) => {
    if (key === 'feed') return pathname === '/feed';
    if (key === 'blog') return pathname.startsWith('/blog');
    if (key === 'studio') return pathname === '/studio' || pathname.startsWith('/studio/');
    if (key === 'notifications') return pathname === '/notifications';
    if (key === 'profile') return pathname.startsWith('/profile');
    return false;
  };

  const items = [
    { key: 'feed', href: '/feed', label: 'Feed', Icon: TrendingUp },
    { key: 'blog', href: '/blog', label: 'Blogs', Icon: FileText },
    { key: 'studio', href: '/studio', label: 'Studio', Icon: Sparkles },
    { key: 'notifications', href: '/notifications', label: 'Alerts', Icon: Bell },
    { key: 'profile', href: profileHref, label: 'Me', Icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <div className="mx-auto max-w-7xl">
        <div className="bg-black/70 backdrop-blur-xl border-t border-purple-500/20">
          <div className="grid grid-cols-5">
            {items.map(({ key, href, label, Icon }) => {
              const active = isActive(key);
              return (
                <Link key={key} href={href} className="block">
                  <div
                    className={[
                      'flex flex-col items-center justify-center gap-1 py-3',
                      'touch-manipulation select-none',
                      active
                        ? 'text-white'
                        : 'text-gray-300',
                    ].join(' ')}
                    style={{ minHeight: 56 }}
                    data-active={active ? 'true' : 'false'}
                  >
                    <div
                      className={[
                        'w-10 h-10 rounded-2xl flex items-center justify-center',
                        active
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30'
                          : 'bg-white/5',
                      ].join(' ')}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={['text-[11px] font-semibold', active ? 'text-white' : 'text-gray-300'].join(' ')}>
                      {label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
