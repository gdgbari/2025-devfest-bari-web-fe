import { Button, Navbar } from 'react-daisyui';
import { firebase } from "../utils"

export const AppBar = () => {


    return <Navbar className='bg-base-100 w-full border-b-4 border-b-red mb-4 mx-0'>
        <div className='flex-1 lg:ml-5 ml-3'>
            <img
                src="/assets/vectors/logo_full.svg"
                alt="Devfest Logo"
                className="h-6"
            />

        </div>
        <Button
            onClick={() => firebase.auth.signOut()}
            className='bg-base-100 text-white hover:bg-red-pastel hover:text-base-100 border-none lg:mr-5 mr-3'
        >
            Logout
        </Button>
    </Navbar>
}