import React from 'react'

export default function GhibliStyleMaker({ result }: any) {

    return (
        <div className='flex gap-3 items-center'>
            {
                !result ?
                    <>
                        <div className="w-6 h-6 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                        <span className='text-[22px]'>Creating Ghibli art...</span>
                    </> :

                    <div className='w-full flex flex-col items-center'>
                        <h2 className='text-[22px] font-semibold'>Ghibli Style Art</h2>
                        <img src={result} alt="Ghibli Style" className='w-[300px] h-[300px] rounded-lg shadow-lg' />
                        <div className='text-center mt-2'>
                            <a href={result} target='_blank' rel="noreferrer" className='text-blue-500 hover:underline'>Download</a>
                        </div>
                    </div>
            }

        </div>
    )
}
