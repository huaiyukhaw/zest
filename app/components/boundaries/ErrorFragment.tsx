import ErrorImage from "~/images/error.png"

export const ErrorFragment = ({ error }: { error: Error }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <img src={ErrorImage} alt="" className="w-16 h-16" />
            <div className="mt-4 text-xl font-semibold">Something went wrong</div>
            <div className="mt-1">{error.message}</div>
        </div>
    )
}

export default ErrorFragment