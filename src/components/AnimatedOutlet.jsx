import React, { useState } from "react"
import { useOutlet } from "react-router-dom"

export default function AnimatedOutlet() {
  const o = useOutlet()
  const [outlet] = useState(o)
  return <>{outlet}</>
}
