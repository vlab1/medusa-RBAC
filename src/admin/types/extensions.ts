import type { ComponentType } from "react"
import { forbiddenRoutes } from "../constants/forbidden-routes"


// Constants



export type ForbiddenRoute = (typeof forbiddenRoutes)[number]

// Base config

interface BaseGeneratedConfig {
  type: "route" | "setting" | "widget"
}

interface RoutingConfig {
  path: string
}

// Route

export type LinkConfig = {
  label: string
  icon?: ComponentType
}

export type RouteConfig = {
  link?: LinkConfig
}

export interface GeneratedRouteConfig
  extends BaseGeneratedConfig,
    RoutingConfig,
    RouteConfig {
  type: "route"
}

// Setting

export type CardConfig = {
  label: string
  description: string
  icon?: ComponentType
}

export type SettingConfig = {
  card: CardConfig
}

export interface GeneratedSettingConfig
  extends BaseGeneratedConfig,
    RoutingConfig,
    SettingConfig {
  type: "setting"
}

// Widget





// Extensions



export type RouteExtension = {
  Component: ComponentType
  config: GeneratedRouteConfig
}

export type SettingExtension = {
  Component: ComponentType
  config: GeneratedSettingConfig
}

export type Extension =  RouteExtension | SettingExtension

// Injected types

export type Widget = {
  origin: string
  Widget: ComponentType<any>
}

export type RouteSegment = {
  path: string
}

export type Route = {
  origin: string
  path: string
  Page: ComponentType<any>
}

export type Setting = {
  origin: string
  path: string
  Page: ComponentType<any>
}

export type Link = {
  label: string
  icon?: ComponentType<any>
  path: string
}

export type Card = {
  label: string
  description: string
  icon?: ComponentType<any>
  path: string
}

// Entry

export type ExtensionsEntry = {
  identifier: string
  extensions: Extension[]
}

// General props

export type Notify = {
  success: (title: string, message: string) => void
  error: (title: string, message: string) => void
  warn: (title: string, message: string) => void
  info: (title: string, message: string) => void
}

export interface WidgetProps {
  notify: Notify
}

export interface RouteProps {
  notify: Notify
}

export interface SettingProps {
  notify: Notify
}
