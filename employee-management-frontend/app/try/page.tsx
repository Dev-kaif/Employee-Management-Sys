"use client"
import { useToast } from "@/components/hooks/use-toast"

export default function DemoButton() {
    const {toast} = useToast()
  return (
    <button
      onClick={() =>
        toast({
          title: "Saved",
          description: "Your changes have been saved!",
        })
      }
    >
      Show Toast
    </button>
  )
}
