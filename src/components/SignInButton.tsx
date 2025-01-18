import { auth, provider, signInWithPopup } from '../lib/firebase'

const SignInButton: React.FC = () => {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('User Info:', user)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  return <button onClick={handleSignIn}>Sign in with Google</button>
}

export default SignInButton
