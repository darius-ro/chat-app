"use client";
import { useAuth } from '@/context/AuthContext';
import CreateAxios from '@/utils/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const auth = useAuth();
    /**
     * im very sorry for anyone looking at these nulls, just gotta be sure, 
     * i mean they could also be empty strings,
     * keyword: could
     */
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id == "email") setEmail(value);
        if (id == "password") setPassword(value);
    }

    const handleSubmit = async () => {
        try {
            const axios = CreateAxios();
            const request = await axios.post("/auth/login", {
                email,
                password,
            }, {validateStatus: () => true}) // I don't care what http status it is, just give me the error attribute in the json :)

            const data = request.data;
            if (data.error) { // oh no. auth failed or something
                setError(data.error);
            } else {
                auth.SetAuthToken(data.token);
                auth.CheckUserAuth();
            }
        } catch (err) {
            console.log(err);
            setError("A error has occured. Check console.")
        }
    }

    useEffect(() => {
        if (auth.user?.logged) { // user logged in, boo
            return router.push("/?error=\"You are already logged in!\"");
        }
    }, [auth.user?.logged, router]);

    return (
        <>
            <div className="flex justify-center items-center text-center h-screen w-screen">
                <div className="bg-neutral-950 rounded-lg border border-neutral-700 p-10 flex w-[90%] max-w-md shadow-lg shadow-black/50 flex-col">
                    <div className={`bg-red-600 rounded-md p-2 mb-4 ${error ? "" : "hidden"}`}>
                        <p id='errorText' className='text-white'>{error}</p>
                    </div>
                    <h1 className="text-xl text-center font-semibold">Sign into your account</h1>
                    <div className="w-full border-neutral-800 border my-6"></div>

                    <span className="text-left text-sm text-neutral-400">Email:</span>

                    <input className="bg-neutral-950 border border-neutral-700 p-2 my-3 placeholder:text-neutral-600 rounded-md ring-0" 
                        type="email" 
                        name="Email" 
                        id="email" 
                        placeholder="you@example.com"
                        onChange={handleChange} />

                    <span className="text-left text-sm text-neutral-400">Password:</span>

                    <input className="bg-neutral-950 border border-neutral-700 p-2 my-3 placeholder:text-neutral-600 rounded-md ring-0" 
                        type="password" 
                        name="Password" 
                        id="password"
                        placeholder="********"
                        onChange={handleChange} />

                    <button onClick={handleSubmit} type="submit" id="login" className="mt-6 text-center font-medium py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer transition rounded-md">Login</button>
                    <p className="mt-4 text-neutral-500 text-sm">
                        Don't have an account? <Link 
                            href="/register" className="text-blue-700 hover:text-blue-800 transition">Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    )
}