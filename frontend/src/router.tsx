import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, useSearchParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useSettings } from './lib/useSharedQueries'
import { Logo } from './components/Logo'
import { ExtensionBoundary } from './extensions/ExtensionBoundary'
import { finalizeFrontendExtensions, getFrontendExtensionLoadErrors, getFrontendExtensionRoutes } from './extensions/registry'

const Watchlist = lazy(() => import('./pages/Watchlist').then(m => ({ default: m.Watchlist })))
const Screener = lazy(() => import('./pages/Screener').then(m => ({ default: m.Screener })))
const Backtest = lazy(() => import('./pages/Backtest').then(m => ({ default: m.Backtest })))
const Factors = lazy(() => import('./pages/Factors').then(m => ({ default: m.Factors })))
const Data = lazy(() => import('./pages/Data').then(m => ({ default: m.Data })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const WheelOS = lazy(() => import('./pages/WheelOS').then(m => ({ default: m.WheelOS })))
const AnalysisDetail = lazy(() => import('./pages/AnalysisDetail').then(m => ({ default: m.AnalysisDetail })))
const Indices = lazy(() => import('./pages/Indices').then(m => ({ default: m.Indices })))
const Branding = lazy(() => import('./pages/Branding').then(m => ({ default: m.Branding })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const Regime = lazy(() => import('./pages/Regime').then(m => ({ default: m.Regime })))
const Dev = lazy(() => import('./pages/Dev').then(m => ({ default: m.Dev })))
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })))
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })))

const CORE_ROUTE_PATHS = new Set(['/', '/wheel', '/onboarding', '/login', '/overview', '/analysis', '/analysis/:menuId', '/watchlist', '/screener', '/backtest', '/factors', '/mining', '/data', '/indices', '/regime', '/branding', '/settings', '/dev', '/settings/keys', '/settings/ai', '/settings/queries'])
finalizeFrontendExtensions(CORE_ROUTE_PATHS)
const frontendExtensionRoutes = getFrontendExtensionRoutes()
const frontendExtensionErrors = getFrontendExtensionLoadErrors()
if (frontendExtensionErrors.length > 0) console.error('部分前端扩展加载失败', frontendExtensionErrors)

function MiningRedirect() {
  const [searchParams] = useSearchParams()
  const search = searchParams.toString()
  return <Navigate to={`/factors?tab=mining${search ? `&${search}` : ''}`} replace />
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const settings = useSettings()
  if (settings.isLoading) return <div className="min-h-full bg-base grid place-items-center"><div className="flex flex-col items-center gap-3 text-muted"><Logo size={28} className="text-foreground" /><div className="text-xs">加载中…</div></div></div>
  if (settings.data && settings.data.onboarding_completed === false) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function RouteFallback() { return <div className="min-h-full bg-base grid place-items-center"><Logo size={28} className="text-foreground" /></div> }

export const router = createBrowserRouter([
  { path: '/onboarding', element: <Suspense fallback={<RouteFallback />}><Onboarding /></Suspense> },
  { path: '/login', element: <Suspense fallback={<RouteFallback />}><Auth /></Suspense> },
  {
    path: '/', element: <OnboardingGuard><Layout /></OnboardingGuard>, children: [
      { index: true, element: <WheelOS /> },
      { path: 'wheel', element: <WheelOS /> },
      { path: 'legacy-dashboard', element: <Dashboard /> },
      { path: 'overview', element: <Navigate to="/" replace /> },
      { path: 'analysis', element: <Navigate to="/settings?tab=pages&section=ext-pages" replace /> },
      { path: 'analysis/:menuId', element: <AnalysisDetail /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'screener', element: <Screener /> },
      { path: 'backtest', element: <Backtest /> },
      { path: 'factors', element: <Factors /> },
      { path: 'mining', element: <MiningRedirect /> },
      { path: 'data', element: <Data /> },
      { path: 'indices', element: <Indices /> },
      { path: 'regime', element: <Regime /> },
      { path: 'branding', element: <Branding /> },
      { path: 'settings', element: <Settings /> },
      { path: 'dev', element: <Dev /> },
      { path: 'settings/keys', element: <Navigate to="/settings?tab=data-sources" replace /> },
      { path: 'settings/ai', element: <Navigate to="/settings?tab=ai" replace /> },
      { path: 'settings/queries', element: <Navigate to="/settings?tab=queries" replace /> },
      ...frontendExtensionRoutes.map(route => { const ExtensionPage = route.component; return { path: route.path.slice(1), element: <ExtensionBoundary extensionId={route.extensionId}><ExtensionPage /></ExtensionBoundary> } }),
    ],
  },
])
