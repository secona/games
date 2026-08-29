import { Outlet, createRootRoute } from '@tanstack/react-router'
import { HomePage } from '../pages/HomePage'

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: HomePage,
})
