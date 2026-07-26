import ProfileDocument from '@/components/seo/ProfileDocument'

// The OS is entirely client-rendered, so without JS the page would be blank. This
// gives no-JS visitors and non-executing crawlers the real content. The scoped
// <style> only parses when scripting is disabled, so it can't affect the OS.
export default function NoScriptProfile() {
  return (
    <noscript>
      <style>{`
        html, body { overflow: auto !important; height: auto !important; }
        .profile-doc { display: block !important; }
      `}</style>
      <ProfileDocument />
    </noscript>
  )
}
