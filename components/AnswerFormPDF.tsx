import React from 'react'

export default function AnswerFormPDF({ result }: any) {

    return (
        <div className='flex gap-3 items-center'>
            {
                !result &&
                <>
                    <div className="w-6 h-6 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                    <span className='text-[24px]'>Generating answer from PDF content</span>
                </>
            }
        </div>
    )
}
