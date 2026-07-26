import OsShell from '@/components/os/OsShell'
import ProfileJsonLd from '@/components/seo/ProfileJsonLd'
import NoScriptProfile from '@/components/seo/NoScriptProfile'

export default function Home() {
  return (
    <>
      <ProfileJsonLd />
      <NoScriptProfile />
      <OsShell />
    </>
  )
}
