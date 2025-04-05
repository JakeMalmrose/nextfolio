"use client"

import React, { useState } from 'react';

const QRCodeGenerator = () => {
  const [text, setText] = useState('https://malmrose.com');
  const [size, setSize] = useState(200);
  const [margin, setMargin] = useState(4);
  const [ecLevel, setEcLevel] = useState('M');
  const [darkColor, setDarkColor] = useState('#BB86FC'); // Using primary color
  const [lightColor, setLightColor] = useState('#1E1E1E'); // Using background-paper color
  const [format, setFormat] = useState('png');
  
  // Generate the QR code URL using the QuickChart API
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=${size}&margin=${margin}&ecLevel=${ecLevel}&dark=${darkColor.substring(1)}&light=${lightColor.substring(1)}&format=${format}`;
  
  return (
    <div className="mt-8 mb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
        QR Code Generator
      </h1>
      
      <div className="paper max-w-md mx-auto">
        <div className="mb-6">
          <label className="block mb-2">Content:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2">Size (px):</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            min="100"
            max="500"
            className="w-full px-3 py-2 bg-background border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Dark Color:</label>
            <div className="flex items-center">
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-10 h-10 cursor-pointer rounded mr-2"
              />
              <span className="text-sm">{darkColor}</span>
            </div>
          </div>
          
          <div>
            <label className="block mb-2">Light Color:</label>
            <div className="flex items-center">
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-10 h-10 cursor-pointer rounded mr-2"
              />
              <span className="text-sm">{lightColor}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Margin:</label>
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value))}
              min="0"
              max="10"
              className="w-full px-3 py-2 bg-background border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block mb-2">Error Correction:</label>
            <select
              value={ecLevel}
              onChange={(e) => setEcLevel(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="L">Low (L)</option>
              <option value="M">Medium (M)</option>
              <option value="Q">Quartile (Q)</option>
              <option value="H">High (H)</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2">Format:</label>
          <div className="flex space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="png"
                checked={format === 'png'}
                onChange={() => setFormat('png')}
                className="form-radio text-primary"
              />
              <span className="ml-2">PNG</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="svg"
                checked={format === 'svg'}
                onChange={() => setFormat('svg')}
                className="form-radio text-primary"
              />
              <span className="ml-2">SVG</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-background rounded-md border border-primary">
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm opacity-70">
            Scan this code with a QR code reader to access the content.
          </p>
          
          <a 
            href={qrCodeUrl} 
            download={`qrcode.${format}`}
            className="px-4 py-2 bg-primary text-background rounded-md hover:opacity-90 transition"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
