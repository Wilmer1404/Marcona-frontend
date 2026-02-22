'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      theme="light"
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast: 'bg-card text-foreground border border-border shadow-lg rounded-lg',
          title: 'font-semibold',
          description: 'text-sm text-muted-foreground',
          actionButton:
            'bg-primary text-primary-foreground hover:bg-primary/90 rounded px-2 py-1 text-xs font-medium',
          cancelButton:
            'bg-muted text-muted-foreground hover:bg-muted/80 rounded px-2 py-1 text-xs font-medium',
          closeButton:
            'bg-muted text-muted-foreground hover:bg-muted/80 absolute right-2 top-2 p-1 rounded',
          error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
          success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50',
          warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50',
          info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50',
        },
      }}
    />
  )
}
