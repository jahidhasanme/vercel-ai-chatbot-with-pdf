// "use client";

// import React from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/thumbnail/lib/styles/index.css";

// interface PDFImageViewerProps {
//     pdfUrl: string;
//     style?: React.CSSProperties;
// }

// const PDFImageViewer: React.FC<PDFImageViewerProps> = ({ pdfUrl, style }) => {
//     const thumbnailPluginInstance = thumbnailPlugin();

//     return (
//         <div style={style}>
//             <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//                 <Viewer fileUrl={pdfUrl} plugins={[thumbnailPluginInstance]} />
//             </Worker>
//         </div>
//     );
// };

// export default PDFImageViewer;
