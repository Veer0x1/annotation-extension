import React, { useEffect, useState } from "react"

import PencilButton from "~/components/PencilButton"

export default function Adder() {
  console.log("Adder")
  let [isTextSelected, setIsTextSelected] = useState<boolean>(false)
  let [selectedText, setSelectedText] = useState<string>("")

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      if (selection) {
        if (!selection.isCollapsed) {
          setIsTextSelected(true)
          setSelectedText(selection.toString().trim())
          console.log(selectedText)
          console.log("hello")
        } else {
          setIsTextSelected(false)
          setSelectedText("")
        }
      }
    }

    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      setIsTextSelected(false)
      setSelectedText("")
    }
  }, [])

  return (
    <div>
      <h1>{selectedText}</h1>
      {/* <ErrorBoundary>
        <h1>bhjgyh</h1>
        <AdderToolbar
        arrowDirection="up"
        isVisible={true}
        // onCommand={() => {}}
        annotationCount={0}
      />
      </ErrorBoundary> */}
      <PencilButton isVisible={isTextSelected}>Click here</PencilButton>
    </div>
  )
}
