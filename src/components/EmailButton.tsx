import { useState } from 'react'

const CopyEmailButton = ({ email }: { email: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy email:', error)
    }
  }

  return (
    <div>
      <button
        onClick={handleCopy}
        className="text-foreground hover:text-blue-300 hover:underline underline-offset-2 hover:cursor-pointer focus:outline-none w-full text-left"
      >
        {isCopied ? 'Link Copied!' : email}
      </button>
    </div>
  )
}

export default CopyEmailButton
