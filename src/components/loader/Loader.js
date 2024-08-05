import Image from 'next/image'
import React from 'react'


const Loader = () => {
    return (
        <div className="h-full flex justify-center items-center">
            <Image
                className="animate-pulse duration-300"
                src="/loader.svg"
                width={100}
                height={100}
                alt="loader"
            />
        </div>
    )
}

export default Loader