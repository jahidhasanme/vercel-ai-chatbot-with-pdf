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
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>('/images/profile.png');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSuccessful) {
      router.refresh();
    }
  }, [isSuccessful, router]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setProfileImage(data.url);
    } else {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('full_name', fullName);
    formData.append('password', password);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('profileImage', profileImage || '/images/profile.png');

    setIsLoading(true);

    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });

    setIsLoading(false);

    if (response.ok) {
      setIsSuccessful(true);
      toast.success('Account created successfully');
      router.push('/');
    } else {
      const errorData = await response.json();
      if (errorData.status === 'user_exists') {
        toast.error('Account already exists');
      } else if (errorData.status === 'invalid_data') {
        toast.error('Failed validating your submission!');
      } else {
        toast.error('Failed to create account');
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
                  src={profileImage||'/images/profile.png'}
                  alt="Profile Image"
                  width={90}
                  height={90}
                  priority
                  className='rounded-full cursor-pointer border-2 border-gray-500 p-1'
                  onClick={() => document.getElementById('profileImageInput')?.click()}
                />
                <p className='text-sm'>Tap to change profile</p>
              </div>
              <input
                type="file"
                id="profileImageInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6 px-4 sm:px-16">
            <div className="flex flex-col gap-2">
              <Label className="text-zinc-600 font-normal dark:text-zinc-400 ml-1">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                className="bg-muted text-md md:text-sm"
                type="text"
                placeholder="Enter your name"
                autoComplete="name"
                required
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-zinc-600 font-normal dark:text-zinc-400 ml-1">
                Confirm Password
              </Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                className="bg-muted text-md md:text-sm"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <Label className="text-zinc-600 font-normal dark:text-zinc-400 ml-1">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  className="bg-muted text-md md:text-sm"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 w-1/2">
                <Label className="text-zinc-600 font-normal dark:text-zinc-400 ml-1">
                  Gender
                </Label>
                <select
                  id="gender"
                  name="gender"
                  className="bg-muted text-md md:text-sm p-2 rounded"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className='w-full mt-6 flex flex-col items-center justify-center'>
            <Button
              type={'submit'}
              className="relative w-1/2"
              disabled={isLoading}
            >
              Register
              {isLoading && (
                <span className="animate-spin absolute right-4">
                  <LoaderIcon />
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {'Already have an account? '}
              <Link
                href="/login"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                Login
              </Link>
              {' instead.'}
            </p>
          </div>
        </form>
        <div className='flex justify-center items-center gap-4'>
          <button
            onClick={() => {
              signIn('google', {
                redirectTo: '/'
              })
            }}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-3 rounded-lg">
            Sign In with Google
          </button>
          {/* <button
            onClick={() => {
              signIn('apple', {
                redirectTo: '/'
              })
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-3 rounded-lg">
            Sign In with Apple
          </button> */}
          <button
            onClick={() => {
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
