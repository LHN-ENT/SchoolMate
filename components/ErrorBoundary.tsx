import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#ECECEC] px-4">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center space-y-4">
            <h1 className="text-2xl font-bold text-[#004225]">Something went wrong</h1>
            <p className="text-gray-700">We’ve encountered an unexpected error. Please try again later.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
