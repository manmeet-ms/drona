import * as React from "react"
import { cn } from "@/src/lib/utils"
import { contentSafety, DetectionResult } from "@/src/lib/content-safety"
import { ContentWarning } from "./content-warning"

interface InputProps extends React.ComponentProps<"input"> {
  enableContentSafety?: boolean
}

function Input({ className, type, enableContentSafety = true, onChange, ...props }: InputProps) {
  const [safetyResult, setSafetyResult] = React.useState<DetectionResult>({ detected: false })
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSafetyCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Skip safety check for specific types where sensitive info is expected
    const isExemptType = type === "email" || type === "password" || type === "tel" || type === "url" 
    
    // Also skip if explicitly disabled prop is passed as false
    // Note: enableContentSafety defaults to true for text fields
    if (!enableContentSafety || isExemptType) {
      if (onChange) onChange(e)
      return
    }

    const value = e.target.value
    const result = contentSafety.detect(value)
    
    setSafetyResult(result)
    
    // Set custom validity to block form submission
    if (result.detected) {
      e.target.setCustomValidity(result.message || "Sensitive content detected")
    } else {
      e.target.setCustomValidity("")
    }

    if (onChange) onChange(e)
  }

  // Effect to re-apply validity if ref exists (in case of other updates)
  React.useEffect(() => {
    if (inputRef.current && safetyResult.detected) {
       inputRef.current.setCustomValidity(safetyResult.message || "Sensitive content detected")
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
      <input
        type={type}
        data-slot="input"
        ref={inputRef}
        onChange={handleSafetyCheck}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          safetyResult.detected && "border-destructive ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
