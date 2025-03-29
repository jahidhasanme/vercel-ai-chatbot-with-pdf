import React from 'react'

export default function GhibliStyleMaker({ result }: any) {

    return (
        <div className='flex gap-3 items-center'>
            {
                !result ?
                    <>
                        <div className="w-6 h-6 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                        <span className='text-[24px]'>Generating ghibli style....</span>
                    </> :

                    <div>
                        <img
                            src={result}
                            height={200}
                            width={200}
                            alt='Loading...'
                        />
                    </div>
            }

        </div>
    )
}
