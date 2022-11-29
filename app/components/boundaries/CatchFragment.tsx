import { Link } from "@remix-run/react"
import ErrorImage from "~/images/error.png"

export const CatchFragment = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img src={ErrorImage} alt="" className="w-16 h-16" />
            <div className="mt-4 z-20 text-xl font-semibold">Looking for something? &#128269;</div>
            <div className="mt-1 z-20">We couldn't find the page you're looking for!</div>
            <div className="mt-4 z-20">
                <Link to="/" className="btn-secondary">Head back</Link>
            </div>
            <div className="absolute z-0 select-none opacity-[5%] filter transition duration-200 blur-sm">
                <h1 className="text-[20rem] font-black">404</h1>
            </div>
        </div>
    )
}

export default CatchFragment