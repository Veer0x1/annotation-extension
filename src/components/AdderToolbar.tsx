import {
  AnnotateIcon,
  ButtonBase,
  HighlightIcon,
  PointerDownIcon,
  PointerUpIcon
} from "@hypothesis/frontend-shared"
import type { IconComponent } from "@hypothesis/frontend-shared/lib/types"
import classnames from "classnames"
import React from "react"

import { useShortcut } from "~shared/shortcut"

/**
 * Render an inverted light-on-dark "pill" with the given `badgeCount`
 * (annotation count). This is rendered instead of an icon on the toolbar
 * button for "show"-ing associated annotations for the current selection.
 */

function NumberIcon({ badgeCount }: { badgeCount: number }) {
  return (
    <span
      className={classnames(
        "rounded px-1 py-0.5",
        // The background color is inherited from the current text color in
        // the containing button and will vary depending on hover state.
        "bg-current"
      )}>
      <span className="font-bold text-color-text-inverted">{badgeCount}</span>
    </span>
  )
}

/**
 * Render an arrow pointing up or down from the AdderToolbar. This arrow
 * should point roughly to the end of the user selection in the document.
 */
function AdderToolbarArrow({
  arrowDirection
}: {
  arrowDirection: "up" | "down"
}) {
  return (
    <div
      className={classnames(
        // Position horizontally center of the AdderToolbar
        "absolute left-1/2 -translate-x-1/2 z-2",
        "fill-white text-grey-3",
        {
          // Move the pointer to the top of the AdderToolbar
          "top-0 -translate-y-full": arrowDirection === "up"
        }
      )}>
      {arrowDirection === "up" ? <PointerUpIcon /> : <PointerDownIcon />}
    </div>
  )
}

type ToolbarButtonProps = {
  badgeCount?: number
  icon?: IconComponent
  label: string
  onClick: () => void
  shortcut: string | null
}

function ToolbarButton({
  badgeCount,
  icon: Icon,
  label,
  onClick,
  shortcut
}: ToolbarButtonProps) {
  useShortcut(shortcut, onClick)
  const title = shortcut ? `${label} (${shortcut})` : label

  return (
    <ButtonBase
      classes={classnames(
        "flex-col gap-y-1 py-2.5 px-2",
        "text-annotator-sm leading-none",
        // Default color when the toolbar is not hovered
        "text-grey-7",
        // When the parent .group element is hovered (but this element itself is
        // not), dim this button's text. This has the effect of dimming inactive
        // buttons.
        "group-hover:text-grey-5",
        // When the parent .group element is hovered AND this element is
        // hovered, this is the "active" button. Intensify the text color, which
        // will also darken any descendant Icon
        "hover:group-hover:text-grey-9"
      )}
      onClick={onClick}
      title={title}>
      {Icon && <Icon className="text-annotator-lg" title={title} />}
      {typeof badgeCount === "number" && <NumberIcon badgeCount={badgeCount} />}
      <span>{label}</span>
    </ButtonBase>
  )
}

/**
 * Render non-visible content for screen readers to announce adder keyboard
 * shortcuts and count of annotations associated with the current selection.
 */
function AdderToolbarShortcuts({
  annotationCount,
  isVisible
}: {
  annotationCount: number
  isVisible: boolean
}) {
  return (
    <div className="sr-only">
      <span
        aria-live="polite"
        aria-atomic="true"
        role="status"
        data-testid="annotation-count-announce">
        {annotationCount > 0 && (
          <span>
            {annotationCount}{" "}
            {annotationCount === 1 ? "annotation" : "annotations"} for this
            selection.
          </span>
        )}
      </span>
      <ul aria-live="polite" data-testid="annotate-shortcuts-announce">
        {isVisible && (
          <>
            {annotationCount > 0 && <li>Press {"'S'"} to show annotations.</li>}
            <li>Press {"'A'"} to annotate.</li>
            <li>Press {"'H'"} to highlight.</li>
          </>
        )}
      </ul>
    </div>
  )
}

export type Command = "annotate" | "highlight" | "show" | "hide"

type AdderToolbarProps = {
  /**
   * Number of annotations associated with the selected text. If non-zero, a
   * "Show" button is displayed to allow the user to see the annotations that
   * correspond to the selection.
   */
  annotationCount?: number
  /**
   * Whether the arrow pointing out of the toolbar towards the selected text
   * should appear above the toolbar pointing up or below the toolbar pointing
   * down.
   */
  arrowDirection: "up" | "down"
  /** The toolbar is always rendered, but is not always visible. */
  isVisible: boolean
  /** Called when a toolbar button is clicked */
  onCommand: (c: Command) => void
}

export default function AdderToolbar({
  arrowDirection,
  isVisible,
  onCommand,
  annotationCount = 0
}: AdderToolbarProps) {
  // Since the selection toolbar is only shown when there is a selection
  // of static text, we can use a plain key without any modifier as
  // the shortcut. This avoids conflicts with browser/OS shortcuts.
  const annotateShortcut = isVisible ? "a" : null
  const highlightShortcut = isVisible ? "h" : null
  const showShortcut = isVisible ? "s" : null
  const hideShortcut = isVisible ? "Escape" : null

  // Add a shortcut to close the adder. Note, there is no button associated with this
  // shortcut because any outside click will also hide the adder.
  useShortcut(hideShortcut, () => onCommand("hide"))

  // nb. The adder is hidden using the `visibility` property rather than `display`
  // so that we can compute its size in order to position it before display.
  return (
    <div
      className={classnames(
        // Reset all inherited properties to their initial values. This prevents
        // CSS property values from the host page being inherited by elements of
        // the Adder, even when using Shadow DOM.
        "all-initial",
        // As we've reset all properties to initial values, we cannot rely on
        // default border values from Tailwind and have to be explicit about all
        // border attributes.
        "border border-solid border-grey-3",
        "absolute select-none bg-white rounded shadow-adder-toolbar",
        // Start at a very low opacity as we're going to fade in the animation
        "opacity-5",
        {
          "animate-adder-pop-up": arrowDirection === "up" && isVisible,
          "animate-adder-pop-down": arrowDirection === "down" && isVisible
        }
      )}
      data-component="AdderToolbar"
      dir="ltr"
      style={{
        visibility: isVisible ? "visible" : "hidden"
      }}>
      <div
        className={classnames(
          // This group is used to manage hover state styling for descendant
          // buttons
          "flex group"
        )}>
        <ToolbarButton
          icon={AnnotateIcon}
          onClick={() => onCommand("annotate")}
          label="Annotate"
          shortcut={annotateShortcut}
        />
        <ToolbarButton
          icon={HighlightIcon}
          onClick={() => onCommand("highlight")}
          label="Highlight"
          shortcut={highlightShortcut}
        />
        {annotationCount > 0 && (
          <>
            <div
              className={classnames(
                // Style a vertical separator line
                "m-1.5 border-r border-grey-4 border-solid"
              )}
            />
            <ToolbarButton
              badgeCount={annotationCount}
              onClick={() => onCommand("show")}
              label="Show"
              shortcut={showShortcut}
            />
          </>
        )}
      </div>
      <AdderToolbarArrow arrowDirection={arrowDirection} />
      <AdderToolbarShortcuts
        annotationCount={annotationCount}
        isVisible={isVisible}
      />
    </div>
  )
}
