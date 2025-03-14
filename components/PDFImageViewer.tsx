"use client";

import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

interface PDFThumbnailViewerProps {
    pdfUrl: string;
    style?: React.CSSProperties;
}

const PDFThumbnailViewer: React.FC<PDFThumbnailViewerProps> = ({ pdfUrl, style }) => {
    const [numPages, setNumPages] = useState<number | null>(null);

    return (
        <div style={{ ...style, overflowX: "auto", display: "flex", gap: "10px" }}>
            <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page key={index} pageNumber={index + 1} width={100} />
                ))}
            </Document>
        </div>
    );
};

export default PDFThumbnailViewer;
