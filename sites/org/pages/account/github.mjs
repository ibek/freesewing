// Hooks
import { useApp } from 'shared/hooks/use-app.mjs'
// Dependencies
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// Components
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'
import { ns as authNs } from 'shared/components/wrappers/auth/index.mjs'
import { ns as githubNs } from 'shared/components/account/github.mjs'

// Translation namespaces used on this page
const namespaces = [...new Set([...githubNs, ...authNs, ...pageNs])]

/*
 * Some things should never generated as SSR
 * So for these, we run a dynamic import and disable SSR rendering
 */
const DynamicAuthWrapper = dynamic(
  () => import('shared/components/wrappers/auth/index.mjs').then((mod) => mod.AuthWrapper),
  { ssr: false }
)

const DynamicGithub = dynamic(
  () => import('shared/components/account/github.mjs').then((mod) => mod.GithubSettings),
  { ssr: false }
)

const AccountPage = (props) => {
  const app = useApp(props)

  return (
    <PageWrapper app={app}>
      <DynamicAuthWrapper app={app}>
        <DynamicGithub app={app} title />
      </DynamicAuthWrapper>
    </PageWrapper>
  )
}

export default AccountPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, namespaces)),
      page: {
        path: ['account', 'github'],
      },
    },
  }
}
