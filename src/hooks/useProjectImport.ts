import { useState, useRef } from 'react'
import {
  validateProjectImport,
  applyProjectImport,
} from '../utils/project-export'
import type { ProjectExport } from '../utils/project-export'

export function useProjectImport() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [pendingImport, setPendingImport] = useState<ProjectExport | null>(null)

  function openFilePicker() {
    setImportError(null)
    fileInputRef.current?.click()
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      const parsed = validateProjectImport(content)
      if (parsed) {
        setImportError(null)
        setPendingImport(parsed)
      } else {
        setImportError(
          'INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT',
        )
      }
    }
    reader.onerror = () => {
      setImportError(
        'INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT',
      )
    }
    reader.readAsText(file)
  }

  function confirmImport() {
    if (!pendingImport) return
    applyProjectImport(pendingImport)
    setPendingImport(null)
    window.location.reload()
  }

  function cancelImport() {
    setPendingImport(null)
  }

  function clearError() {
    setImportError(null)
  }

  return {
    fileInputRef,
    importError,
    pendingImport,
    openFilePicker,
    handleFileSelected,
    confirmImport,
    cancelImport,
    clearError,
  }
}
