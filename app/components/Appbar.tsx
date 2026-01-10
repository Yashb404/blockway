'use client';
import { signIn, signOut, useSession } from "next-auth/react"
import PrimaryButton from "./PrimaryButton";


export const Appbar = () =>{
    const session = useSession();
    return <div className="border-b px-2 py-2 flex justify-between">
        <div className="font-bold text-lg flex-col justify-center">
            Blockway
        </div>
        <div>
            {session.data?.user?<PrimaryButton onClick={() => signOut()}>Log Out</PrimaryButton>:
            
            
            <PrimaryButton onClick={() => signIn()}>Sign In</PrimaryButton>}            
        </div>
    </div>
}