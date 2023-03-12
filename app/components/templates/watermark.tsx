import { Link } from "@remix-run/react"

const Watermark = () => {
    return (
        <div className="fixed bottom-6 right-6 flex gap-2">
            <Link to="/" className="btn-secondary">
                <img src="/zest.svg" alt="" className="inline-block w-4 h-4 -ml-1 mr-1" />
                <span>
                    Made in Zest
                </span>
            </Link>
        </div>
    )
}

export default Watermark