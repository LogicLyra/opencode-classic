import type { JSX } from "solid-js"
import { Dynamic } from "solid-js/web"
import "./attachment-card-v2.css"

/** Shared 160px two-line card used by v2 file and comment attachments in the composer and timeline. */
export function AttachmentCardV2(props: {
  title: string
  active?: boolean
  clickable?: boolean
  wide?: boolean
  surface?: "base"
  /** native title attribute */
  hover?: string
  titleRef?: (element: HTMLSpanElement) => void
  onClick?: () => void
  children: JSX.Element
}) {
  const interactive = () => !!props.clickable && !!props.onClick
  return (
    <Dynamic
      component={interactive() ? "button" : "div"}
      type={interactive() ? "button" : undefined}
      data-component="attachment-card-v2"
      data-active={props.active ? "true" : undefined}
      data-clickable={interactive() ? "true" : undefined}
      data-wide={props.wide ? "true" : undefined}
      data-surface={props.surface}
      title={props.hover}
      onClick={interactive() ? props.onClick : undefined}
    >
      <span ref={(element) => props.titleRef?.(element)} data-slot="attachment-card-v2-title">
        {props.title}
      </span>
      <span data-slot="attachment-card-v2-subtitle">{props.children}</span>
    </Dynamic>
  )
}
