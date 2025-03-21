'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSuccessful) {
      router.refresh();
    }
  }, [isSuccessful, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    setIsLoading(true);

    const response = await fetch('/api/login', {
      method: 'POST',
      body: formData,
    });

    setIsLoading(false);

    if (response.ok) {
      setIsSuccessful(true);
      toast.success('Login successful');
      router.push('/');
    } else {
      const errorData = await response.json();
      if (errorData.status === 'invalid_data') {
        toast.error('Failed validating your submission!');
      } else {
        toast.error('Invalid credentials!');
      }
    }
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-6 flex flex-col">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-3 px-4 text-center sm:px-16">
            <div className="relative">
              <div className='flex flex-col justify-center items-center gap-1'>
                <Image
                  src="/images/icon.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  priority
                  className='rounded-full'
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-8 px-4 sm:px-16">
            <div className="flex flex-col gap-2">
              <Label className="text-zinc-600 font-normal dark:text-zinc-400 ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                className="bg-muted text-md md:text-sm"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-zinc-600 font-normal dark:text-zinc-400 ml-1">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="bg-muted text-md md:text-sm"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className='w-full mt-6 flex flex-col items-center justify-center'>
            <Button
              type={'submit'}
              className="relative w-1/2"
              disabled={isLoading}
            >
              Login
              {isLoading && (
                <span className="animate-spin absolute right-4">
                  <LoaderIcon />
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                Register
              </Link>
              {' for free.'}
            </p>
          </div>
        </form>
        <div className='flex justify-center items-center gap-4'>
          <button
            onClick={()=>{
              signIn('google', {
                redirectTo: '/'
              })
            }}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-3 rounded-lg">
            Sign In with Google
          </button>
          {/* <button
            onClick={()=>{
              signIn('apple', {
                redirectTo: '/'
              })
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-3 rounded-lg">
            Sign In with Apple
          </button> */}
          <button
            onClick={()=>{
              signIn('github', {
                redirectTo: '/'
              })
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-3 rounded-lg">
            Sign In with Github
          </button>
        </div>
      </div>
    </div>
  );
}
