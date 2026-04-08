import { Store, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a5220, #226b2a)', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '3rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
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
              <span className="font-heading" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>KasiBusket</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 1rem' }}>
              SA's leading kasi delivery platform. Empowering township entrepreneurs across all 9 provinces.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['📘', '🐦', '📸', '▶️'].map(icon => (
                <button key={icon} style={{ width: '2rem', height: '2rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', transition: 'background 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)')}
                >{icon}</button>
              ))}
            </div>
          </div>
          {/* Quick links */}
          <div>
            <h4 className="font-heading" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
            {['About Us', 'Browse Shops', 'Register Shop', 'Track Order', 'Contact Support'].map(link => (
              <div key={link} style={{ marginBottom: '0.4rem' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
                >→ {link}</a>
              </div>
            ))}
          </div>
          {/* Services */}
          <div>
            <h4 className="font-heading" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services</h4>
            {['🛒 Grocery Delivery', '💳 Buy Now Pay Later', '🤖 AI Recommendations', '♿ Disability Support', '🎮 Loyalty Rewards', '🏠 Property Listings'].map(svc => (
              <div key={svc} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginBottom: '0.4rem' }}>{svc}</div>
            ))}
          </div>
          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-heading" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stay Updated</h4>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <input placeholder="Your email address" style={{ flex: 1, padding: '0.55rem 0.9rem', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '0.65rem 0 0 0.65rem', color: 'white', fontSize: '0.8rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
              <button style={{ padding: '0.55rem 0.9rem', background: '#f59e0b', border: 'none', borderRadius: '0 0.65rem 0.65rem 0', cursor: 'pointer', color: '#1a0e00', fontWeight: 700, fontSize: '0.8rem' }}>Go</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[{ icon: <MapPin size={12}/>, text: 'All 9 SA Provinces' }, { icon: <Phone size={12}/>, text: '+27 80 000 KASI' }, { icon: <Mail size={12}/>, text: 'hello@kasibusket.co.za' }].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>
                  <span style={{ color: '#f59e0b' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', margin: 0 }}>© 2025 KasiBusket. All rights reserved. Powered by Huawei Cloud.</p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
              >{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}