import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('accepts a custom type prop', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('merges className with its base styles', () => {
    render(<Button className="bg-blue-500">Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-blue-500')
    expect(btn.className).toContain('rounded-xl')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and does not fire onClick when the disabled prop is set', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards arbitrary HTML button attributes', () => {
    render(<Button aria-label="close dialog">X</Button>)
    expect(screen.getByLabelText('close dialog')).toBeInTheDocument()
  })
})
