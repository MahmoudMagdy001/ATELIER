import React, { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <div className="w-full space-y-1.5 text-start">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold tracking-wide text-[#b3a9a3]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`w-full px-4 py-2.5 rounded-xl border bg-[#141110] text-[#f2efe8] placeholder-[#827771] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C4A070] focus:border-transparent ${
          error ? 'border-red-500/70 focus:ring-red-500' : 'border-[#C4A070]/30 hover:border-[#C4A070]/50'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-400 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-[#827771]">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const generatedId = React.useId()
  const textareaId = id || generatedId

  return (
    <div className="w-full space-y-1.5 text-start">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold tracking-wide text-[#b3a9a3]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        className={`w-full px-4 py-2.5 rounded-xl border bg-[#141110] text-[#f2efe8] placeholder-[#827771] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C4A070] focus:border-transparent ${
          error ? 'border-red-500/70 focus:ring-red-500' : 'border-[#C4A070]/30 hover:border-[#C4A070]/50'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} role="alert" className="text-xs text-red-400 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="text-xs text-[#827771]">
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const generatedId = React.useId()
  const selectId = id || generatedId

  return (
    <div className="w-full space-y-1.5 text-start">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold tracking-wide text-[#b3a9a3]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        className={`w-full px-4 py-2.5 rounded-xl border bg-[#141110] text-[#f2efe8] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C4A070] focus:border-transparent ${
          error ? 'border-red-500/70 focus:ring-red-500' : 'border-[#C4A070]/30 hover:border-[#C4A070]/50'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${selectId}-error`} role="alert" className="text-xs text-red-400 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="text-xs text-[#827771]">
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'
