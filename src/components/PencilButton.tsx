import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import type { ButtonHTMLAttributes } from "react"

interface PencilButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  isVisible: boolean
}

const PencilButton: React.FC<PencilButtonProps> = ({
  children,
  onClick,
  isVisible
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        visibility: isVisible ? "visible" : "hidden"
      }}>
      {children} <FontAwesomeIcon icon={faPencilAlt} />
    </button>
  )
}
export default PencilButton
