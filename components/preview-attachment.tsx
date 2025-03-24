import type { Attachment } from 'ai';

import { LoaderIcon } from './icons';
import Image from 'next/image';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  uploadProgress
}: {
  attachment: Attachment;
  isUploading?: boolean;
  uploadProgress?: {
    fileName: string;
    percent: number
  };
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2">
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith('image') ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={name ?? 'An image attachment'}
              className="rounded-md size-full object-cover"
            />
          ) : (
            <div className="justify-center items-center flex p-5">
              <Image src={'/images/pdf.png'} height={60} width={60} alt='PDF' priority />
            </div>
          )
        ) : (
          <div className="" />
        )}

        {isUploading && (<>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md"></div>
          <div
            data-testid="input-attachment-loader"
            className="animate-spin text-zinc-500"
          >
            <LoaderIcon />
          </div>
          {uploadProgress && (
            <>
              <div className="text-xs text-zinc-500 mt-1">
                {uploadProgress.percent}%
              </div>
              <div className="w-16 h-1 bg-zinc-200 rounded-full mt-1">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percent}%` }}
                />
              </div>
            </>
          )}
        </>
        )}
      </div>
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
