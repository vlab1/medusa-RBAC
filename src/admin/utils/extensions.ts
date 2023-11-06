import {
  Extension,
  Route,
  RouteExtension,
  RouteSegment,
  SettingExtension,
} from "../types/extensions"



export function isRouteExtension(
  extension: Extension
): extension is RouteExtension {
  return "config" in extension && extension.config.type === "route"
}

export function isSettingExtension(
  extension: Extension
): extension is SettingExtension {
  return "config" in extension && extension.config.type === "setting"
}

export function isRoute(route: Route | RouteSegment): route is Route {
  return "Page" in route
}
