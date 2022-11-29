import { Link } from "@remix-run/react"
import LemonImage from "~/images/lemon.png"

export const CatchPage = () => {
    return (
        <div className="flex flex-col items-center min-h-screen justify-center">
            <img src={LemonImage} alt="" className="w-32 h-32" />
            <div className="text-xl font-semibold z-20">Looking for something? &#128269;</div>
            <div className="mt-2 z-20">We couldn't find the page you're looking for!</div>
            <div className="mt-4 z-20">
                <Link to="/" className="btn-secondary">Head back</Link>
            </div>
            <div className="absolute z-0 select-none opacity-[5%] filter transition duration-200 blur-sm">
                <h1 className="text-[28rem] font-black">404</h1>
            </div>
        </div>
    )
}

export default CatchPage