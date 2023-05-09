import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import type { ButtonHTMLAttributes } from "react"

interface PencilButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
}

const PencilButton: React.FC<PencilButtonProps> = ({
  children,
  onClick,
  ...props
}) => {
  return (
    <button onClick={onClick} {...props}>
      {children} <FontAwesomeIcon icon={faPencilAlt} />
    </button>
  )
}
export default PencilButton
