import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('defaults to type="text"', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('accepts a custom type', () => {
    render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('renders with a placeholder', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('merges className with base styles', () => {
    render(<Input className="mt-4" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('mt-4')
    expect(input.className).toContain('rounded-2xl')
  })

  it('calls onChange when the user types', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('reflects a controlled value', () => {
    render(<Input value="prefilled" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('prefilled')
  })

  it('forwards arbitrary HTML input attributes', () => {
    render(<Input aria-label="search field" />)
    expect(screen.getByLabelText('search field')).toBeInTheDocument()
  })
})
