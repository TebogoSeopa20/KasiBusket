import { Search, ShoppingCart, User, Menu, Store, Bell } from "lucide-react";

interface HeaderProps {
  cartItemsCount?: number;
  onMenuToggle?: () => void;
  userName?: string;
}

export function Header({ cartItemsCount = 0, onMenuToggle, userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 spaza-header shadow-lg" style={{ background: '#226b2a' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu style={{ width: '1.1rem', height: '1.1rem', color: 'white' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '2.2rem', 
              height: '2.2rem', 
              background: 'white', 
              borderRadius: '0.6rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '1.5px solid rgba(255,255,255,0.3)',
              overflow: 'hidden'
            }}>
              <img 
                src="https://i.pinimg.com/736x/29/b3/db/29b3db40387d3b7f5b7f687c8d46505d.jpg"
                alt="KasiBusket Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.background = 'rgba(255,255,255,0.2)';
                    parent.innerHTML = '<span style="font-size: 1rem;">🛒</span>';
                  }
                }}
              />
            </div>
            <div>
              <span className="font-heading" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'white', display: 'block', lineHeight: 1.1 }}>KasiBusket</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>Powered by Huawei Cloud</span>
            </div>
          </div>
        </div>

        {/* Search - hidden on mobile */}
        <div style={{ flex: 1, maxWidth: '28rem', margin: '0 1.5rem', position: 'relative', display: 'flex' }} className="hidden sm:flex">
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.9rem', height: '0.9rem', color: 'rgba(255,255,255,0.6)' }} />
          <input
            placeholder="Search products or shops..."
            style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '1rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '9999px', color: 'white', fontSize: '0.85rem', fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none' }}
            onFocus={e => (e.target.style.background = 'rgba(255,255,255,0.22)')}
            onBlur={e => (e.target.style.background = 'rgba(255,255,255,0.15)')}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '9999px', padding: '0.45rem 0.75rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, position: 'relative', transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)')}
          >
            <Bell style={{ width: '1rem', height: '1rem' }} />
          </button>
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '9999px', padding: '0.45rem 0.75rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, position: 'relative', transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)')}
          >
            <ShoppingCart style={{ width: '1rem', height: '1rem' }} />
            {cartItemsCount > 0 && (
              <span style={{ position: 'absolute', top: '-0.3rem', right: '-0.3rem', background: '#f59e0b', color: '#1a0e00', fontSize: '0.65rem', fontWeight: 800, width: '1.1rem', height: '1.1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartItemsCount}
              </span>
            )}
          </button>
          {userName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.35rem 0.8rem 0.35rem 0.35rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              <div style={{ width: '1.6rem', height: '1.6rem', background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1a0e00' }}>{userName.charAt(0).toUpperCase()}</span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', maxWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}