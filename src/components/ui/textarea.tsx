import * as React from "react"
import { cn } from "@/src/lib/utils"
import { contentSafety, DetectionResult } from "@/src/lib/content-safety"
import { ContentWarning } from "./content-warning"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  enableContentSafety?: boolean
}

function Textarea({ className, enableContentSafety = true, onChange, ...props }: TextareaProps) {
  const [safetyResult, setSafetyResult] = React.useState<DetectionResult>({ detected: false })
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSafetyCheck = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!enableContentSafety) {
      if (onChange) onChange(e)
      return
    }

    const value = e.target.value
    const result = contentSafety.detect(value)
    
    setSafetyResult(result)
    
    if (result.detected) {
      e.target.setCustomValidity(result.message || "Sensitive content detected")
    } else {
      e.target.setCustomValidity("")
    }

    if (onChange) onChange(e)
  }

  React.useEffect(() => {
    if (textareaRef.current && safetyResult.detected) {
       textareaRef.current.setCustomValidity(safetyResult.message || "Sensitive content detected")
    }
  }, [safetyResult])

  return (
    <div className="relative w-full">
      {safetyResult.detected && (
        <ContentWarning 
          result={safetyResult} 
          className="mb-2 animate-in fade-in slide-in-from-bottom-1" 
        />
      )}
      <textarea
        data-slot="textarea"
        ref={textareaRef}
        onChange={handleSafetyCheck}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          safetyResult.detected && "border-destructive ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Textarea }
