'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/dashboard') // Redirect to dashboard after successful sign in
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6F4E37]">
      <Card className="w-full max-w-md bg-[#D2B48C] text-[#3E2723]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign in to Coffee Haven</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#E6CCB2] border-[#8B4513]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#E6CCB2] border-[#8B4513]"
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-[#8B4513] hover:bg-[#6F4E37] text-white">
              Sign In
            </Button>
          </form>
          <div className="mt-4">
            <Button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full bg-white text-[#3E2723] hover:bg-gray-200"
            >
              Sign in with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Dont have an account?{' '}
            <Link href="/auth/register" className="text-[#8B4513] hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

