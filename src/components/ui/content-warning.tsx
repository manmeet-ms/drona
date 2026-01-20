import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { DetectionResult } from "@/src/lib/content-safety"
import { TriangleAlert } from "lucide-react"

interface ContentWarningProps {
  result: DetectionResult
  className?: string
}

export function ContentWarning({ result, className }: ContentWarningProps) {
  if (!result.detected) return null

  return (
    <Alert variant="destructive" className={className}>
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Safety Policy Violation</AlertTitle>
      <AlertDescription>
        {result.message}
        {result.matchedContent && result.matchedContent.length > 0 && (
          <div className="mt-2 text-xs font-mono bg-destructive/10 p-1 rounded break-all">
            Detected: {result.matchedContent.join(", ")}
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
