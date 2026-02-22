import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Coffee } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
    const { cafeInfo, language } = useStore();
    const qrRef = useRef<SVGSVGElement>(null);

    const downloadQR = () => {
        if (!qrRef.current) return;
        const svg = qrRef.current;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QR_${cafeInfo.name}.png`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-info">
                    <div className="logo-section mb-2">
                        {cafeInfo.logo ? (
                            <img src={cafeInfo.logo} alt="Logo" className="logo-img" />
                        ) : (
                            <Coffee className="logo-icon" size={32} />
                        )}
                        <span className="shop-name footer-name">{cafeInfo.name}</span>
                    </div>
                    <p className="footer-desc">
                        {language === 'en'
                            ? 'Enjoy the best coffee in town. Modern, minimal, and crafted with love.'
                            : 'រីករាយជាមួយកាហ្វេល្អបំផុតក្នុងក្រុង។ ទំនើប និងឆ្ងាញ់។'}
                    </p>
                    <p className="copyright">© {new Date().getFullYear()} {cafeInfo.name}. All rights reserved.</p>
                </div>

                <div className="footer-qr">
                    <p className="qr-title">{language === 'en' ? 'Scan to view our menu' : 'ស្កេនដើម្បីមើលម៉ឺនុយ'}</p>
                    <div className="qr-box">
                        <QRCodeSVG
                            value={cafeInfo.url || window.location.origin}
                            size={160}
                            fgColor="#000000"
                            level="H"
                            includeMargin={false}
                            ref={qrRef}
                        />
                    </div>
                    <button className="qr-download-btn" onClick={downloadQR}>
                        <Download size={16} />
                        {language === 'en' ? 'Download QR' : 'ទាញយក QR'}
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
