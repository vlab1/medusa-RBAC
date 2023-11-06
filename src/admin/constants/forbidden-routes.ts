export const forbiddenRoutes = [
  "/staff/role",
  "/staff/permission",
] as const

export const isSettingsRoute = (route: string) => {
  return route.startsWith("/settings")
}

export const isForbiddenRoute = (route: any): boolean => {
  if (isSettingsRoute(route)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `The route "${route}" is a settings route. Please register the extension in the "settings" directory instead.`
      )
    }

    return true
  }

  if (forbiddenRoutes.includes(route)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `The route "${route}" is a forbidden route. We do not currently support overriding default routes.`
      )
    }

    return true
  }

  return false
}
