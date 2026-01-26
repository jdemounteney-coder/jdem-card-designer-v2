import React, { useState, Fragment } from 'react';
import { Upload, Printer, Trash2, Check } from 'lucide-react';

export default function PlayingCardDesigner() {
  const [suits, setSuits] = useState({ hearts: null, diamonds: null, clubs: null, spades: null });
  const [numbers, setNumbers] = useState({
    A: null, '2': null, '3': null, '4': null, '5': null, '6': null,
    '7': null, '8': null, '9': null, '10': null, J: null, Q: null, K: null
  });
  const [faceCards, setFaceCards] = useState({
    'hearts-J': null, 'hearts-Q': null, 'hearts-K': null, 'diamonds-J': null, 'diamonds-Q': null, 'diamonds-K': null,
    'clubs-J': null, 'clubs-Q': null, 'clubs-K': null, 'spades-J': null, 'spades-Q': null, 'spades-K': null
  });
  const [cardBack, setCardBack] = useState(null);
  const [cornerStyle, setCornerStyle] = useState('two');
  const [paperSize, setPaperSize] = useState('A4');
  const [cardSize, setCardSize] = useState('bridge');
  const [cardStyle, setCardStyle] = useState('playing');
  const [pictureCardImages, setPictureCardImages] = useState({
    A: null, '2': null, '3': null, '4': null, '5': null, '6': null,
    '7': null, '8': null, '9': null, '10': null, J: null, Q: null, K: null
  });
  const [showCutLines, setShowCutLines] = useState(true);
  const [printMode, setPrintMode] = useState('screen');
  const [printView, setPrintView] = useState(null);
  const [step, setStep] = useState('suits');
  const [showBacks, setShowBacks] = useState(false);

  const suitNames = ['hearts', 'diamonds', 'clubs', 'spades'];
  const numberValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const faceValues = ['J', 'Q', 'K'];
  const allValues = [...numberValues, ...faceValues];

  const handleFileUpload = (callback) => (file) => {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
  };

  const handlePaste = (e, setter, key) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) handleFileUpload((data) => setter(prev => key ? {...prev, [key]: data} : data))(file);
        return;
      }
    }
  };

  const handleDrop = (e, setter, key) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files?.[0]?.type.indexOf('image') !== -1) {
      handleFileUpload((data) => setter(prev => key ? {...prev, [key]: data} : data))(files[0]);
    }
  };

  const allSuitsUploaded = Object.values(suits).every(s => s);
  const allNumbersUploaded = Object.values(numbers).every(n => n);
  const allFaceCardsUploaded = Object.values(faceCards).every(f => f);
  const allPictureCardImagesUploaded = Object.values(pictureCardImages).every(p => p);
  const cardBackUploaded = !!cardBack;

  const getPipPositions = (value) => {
    const positions = {
      'A': [[50,50]], '2': [[50,25],[50,75]], '3': [[50,25],[50,50],[50,75]],
      '4': [[30,30],[70,30],[30,70],[70,70]], '5': [[30,30],[70,30],[50,50],[30,70],[70,70]],
      '6': [[30,25],[70,25],[30,50],[70,50],[30,75],[70,75]],
      '7': [[30,25],[70,25],[30,50],[50,38],[70,50],[30,75],[70,75]],
      '8': [[30,20],[70,20],[30,40],[70,40],[30,60],[70,60],[30,80],[70,80]],
      '9': [[30,20],[70,20],[30,40],[70,40],[50,50],[30,60],[70,60],[30,80],[70,80]],
      '10': [[30,18],[70,18],[30,35],[70,35],[50,28],[50,72],[30,65],[70,65],[30,82],[70,82]]
    };
    return positions[value] || [];
  };

  const generateDeck = () => {
    const deck = [];
    suitNames.forEach(suit => {
      allValues.forEach(value => {
        deck.push({ suit, value, id: `${suit}-${value}`, type: faceValues.includes(value) ? 'face' : 'number' });
      });
    });
    return deck;
  };

  const exportAsSVG = () => {
    const deck = generateDeck();
    const cardWidth = cardSize === 'bridge' ? 57 : 63.5;
    const cardHeight = 88.9;
    const cardsPerRow = cardSize === 'bridge' ? 4 : 3;
    const cardsPerPage = paperSize === 'A4' ? (cardSize === 'bridge' ? 8 : 6) : (cardSize === 'bridge' ? 16 : 12);
    const cols = cardsPerRow;
    const rows = cardsPerPage / cols;
    const pageWidth = paperSize === 'A4' ? 297 : 420;
    const pageHeight = paperSize === 'A4' ? 210 : 297;
    
    let svgContent = '';
    
    for (let i = 0; i < deck.length; i += cardsPerPage) {
      const pageCards = deck.slice(i, i + cardsPerPage);
      
      const totalWidth = cols * cardWidth;
      const totalHeight = rows * cardHeight;
      const offsetX = (pageWidth - totalWidth) / 2;
      const offsetY = (pageHeight - totalHeight) / 2;
      
      svgContent += `
<svg width="${pageWidth}mm" height="${pageHeight}mm" viewBox="0 0 ${pageWidth} ${pageHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="${pageWidth}" height="${pageHeight}" fill="white"/>
`;
      
      pageCards.forEach((card, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const x = offsetX + col * cardWidth;
        const y = offsetY + row * cardHeight;
        
        const cardContent = `
  <g transform="translate(${x}, ${y})">
    <rect width="${cardWidth}" height="${cardHeight}" fill="white" stroke="black" stroke-width="1" rx="2"/>
    ${showCutLines ? `<rect width="${cardWidth}" height="${cardHeight}" fill="none" stroke="#cccccc" stroke-width="0.2" stroke-dasharray="2,2"/>` : ''}
    
    ${card.type === 'number' ? `
    <g transform="translate(2, 2)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    <g transform="translate(${cardWidth - 2}, ${cardHeight - 2}) rotate(180)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    ${cornerStyle === 'four' ? `
    <g transform="translate(${cardWidth - 2}, 2) scale(-1, 1)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    <g transform="translate(2, ${cardHeight - 2}) rotate(180) scale(-1, 1)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    ` : ''}
    
    ${getPipPositions(card.value).map(pos => {
      const pipX = (cardWidth * pos[0] / 100);
      const pipY = (cardHeight * pos[1] / 100);
      const pipSize = card.value === 'A' ? 80 : 30;
      const rotation = pos[1] > 50 ? 180 : 0;
      return `<image href="${suits[card.suit]}" x="${pipX - pipSize/2}" y="${pipY - pipSize/2}" width="${pipSize}" height="${pipSize}" transform="rotate(${rotation}, ${pipX}, ${pipY})"/>`;
    }).join('\n    ')}
    ` : `
    <g transform="translate(2, 2)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    <g transform="translate(${cardWidth - 2}, ${cardHeight - 2}) rotate(180)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    ${cornerStyle === 'four' ? `
    <g transform="translate(${cardWidth - 2}, 2) scale(-1, 1)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    <g transform="translate(2, ${cardHeight - 2}) rotate(180) scale(-1, 1)">
      <image href="${numbers[card.value]}" width="6" height="6"/>
      <image href="${suits[card.suit]}" x="0" y="7" width="4" height="4"/>
    </g>
    ` : ''}
    
    <rect x="6" y="6" width="${cardWidth - 12}" height="${cardHeight - 12}" fill="white" stroke="#999" stroke-width="0.5" rx="1"/>
    <image href="${faceCards[`${card.suit}-${card.value}`]}" x="6" y="6" width="${cardWidth - 12}" height="${cardHeight - 12}" preserveAspectRatio="xMidYMid meet"/>
    `}
  </g>
`;
        svgContent += cardContent;
      });
      
      svgContent += `</svg>\n\n`;
    }
    
    const fullSVG = `<?xml version="1.0" encoding="UTF-8"?>\n${svgContent}`;
    const blob = new Blob([fullSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `playing-cards-deck-${paperSize}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getBacksForDoubleSided = (deck) => {
    const cardWidth = cardSize === 'bridge' ? 57 : 63.5;
    const cardsPerRow = cardSize === 'bridge' ? 4 : 3;
    const cardsPerPage = paperSize === 'A4' ? (cardSize === 'bridge' ? 8 : 6) : (cardSize === 'bridge' ? 16 : 12);
    const cols = cardsPerRow;
    const rows = cardsPerPage / cols;
    const pages = [];
    
    for (let i = 0; i < deck.length; i += cardsPerPage) {
      const pageCards = deck.slice(i, i + cardsPerPage);
      const flippedBacks = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          if (idx < pageCards.length) {
            flippedBacks[row * cols + (cols - 1 - col)] = pageCards[idx];
          }
        }
      }
      pages.push(flippedBacks.filter(Boolean));
    }
    return pages.flat();
  };

  const handlePrintInNewWindow = (mode) => {
    // Create a new window with the print content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to use the print feature');
      return;
    }

    // Set the print mode to generate the correct content
    setPrintMode(mode);
    
    // Wait for React to render, then copy content to new window
    setTimeout(() => {
      const printContent = document.querySelector('.print-content');
      if (printContent) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Print Cards - JdeM's Playing Card Design Tool</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print { 
                body { margin: 0; } 
                @page { margin: 25.4mm; size: ${paperSize} ${paperSize === 'A4' ? 'landscape' : 'portrait'}; } 
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();
        
        // Trigger print dialog after a brief delay
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
      
      // Reset to screen mode
      setPrintMode('screen');
    }, 200);
  };

  const CornerSymbol = ({ value, suit, rotated }) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: rotated ? 'rotate(180deg)' : 'none'}}>
      <img src={numbers[value]} alt={value} style={{width: '24px', height: '24px', objectFit: 'contain', marginBottom: '4px'}} />
      <img src={suits[suit]} alt={suit} style={{width: '16px', height: '16px', objectFit: 'contain'}} />
    </div>
  );

  const CutMarks = () => (
    <>
      <div className="absolute top-0 left-0 w-3 h-px bg-gray-400" style={{top: '-2px'}}></div>
      <div className="absolute top-0 left-0 h-3 w-px bg-gray-400" style={{left: '-2px'}}></div>
      <div className="absolute top-0 right-0 w-3 h-px bg-gray-400" style={{top: '-2px'}}></div>
      <div className="absolute top-0 right-0 h-3 w-px bg-gray-400" style={{right: '-2px'}}></div>
      <div className="absolute bottom-0 left-0 w-3 h-px bg-gray-400" style={{bottom: '-2px'}}></div>
      <div className="absolute bottom-0 left-0 h-3 w-px bg-gray-400" style={{left: '-2px'}}></div>
      <div className="absolute bottom-0 right-0 w-3 h-px bg-gray-400" style={{bottom: '-2px'}}></div>
      <div className="absolute bottom-0 right-0 h-3 w-px bg-gray-400" style={{right: '-2px'}}></div>
    </>
  );

  const CardFront = ({ card }) => (
    <div style={{position: 'relative', backgroundColor: 'white', border: '1px solid #9ca3af', borderRadius: '8px', overflow: 'hidden', width: '100%', height: '100%'}}>
      <div style={{position: 'absolute', top: '8px', left: '8px', zIndex: 10}}><CornerSymbol value={card.value} suit={card.suit} /></div>
      <div style={{position: 'absolute', bottom: '8px', right: '8px', zIndex: 10}}><CornerSymbol value={card.value} suit={card.suit} rotated /></div>
      {cornerStyle === 'four' && (
        <>
          <div style={{position: 'absolute', top: '8px', right: '8px', zIndex: 10}}><CornerSymbol value={card.value} suit={card.suit} /></div>
          <div style={{position: 'absolute', bottom: '8px', left: '8px', zIndex: 10}}><CornerSymbol value={card.value} suit={card.suit} rotated /></div>
        </>
      )}
      {cardStyle === 'picture' ? (
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5mm'}}>
          <img 
            src={pictureCardImages[card.value]} 
            alt={`${card.value} of ${card.suit}`} 
            style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}}
          />
        </div>
      ) : card.type === 'number' ? (
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            {getPipPositions(card.value).map((pos, idx) => (
              <div key={idx} style={{position: 'absolute', left: `${pos[0]}%`, top: `${pos[1]}%`, transform: 'translate(-50%, -50%)'}}>
                <img src={suits[card.suit]} alt={card.suit}
                  style={{objectFit: 'contain', transform: pos[1] > 50 ? 'rotate(180deg)' : 'none', width: card.value === 'A' ? '80px' : '30px', height: card.value === 'A' ? '80px' : '30px'}}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
          <div style={{width: '100%', height: '100%', border: '2px solid #9ca3af', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'white'}}>
            <img src={faceCards[`${card.suit}-${card.value}`]} alt={`${card.value} of ${card.suit}`} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
        </div>
      )}
    </div>
  );

  const UploadBox = ({ value, onUpload, image, label }) => (
    <div className="flex flex-col items-center">
      <label className="w-full cursor-pointer">
        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} className="hidden" />
        <div
          className={`border-4 rounded-lg p-4 text-center transition ${image ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50'}`}
          onPaste={(e) => handlePaste(e, ...value)}
          onDrop={(e) => handleDrop(e, ...value)}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          tabIndex={0}
        >
          {image ? <img src={image} alt={label} className="w-24 h-24 mx-auto object-contain" /> : 
            <div><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-xs text-gray-500">Click, paste, or drag</p></div>
          }
        </div>
      </label>
      <p className="mt-2 font-semibold text-gray-700">{label}</p>
      {image && <button onClick={() => value[0](prev => ({...prev, [value[1]]: null}))} className="mt-1 text-red-500 text-xs"><Trash2 className="w-3 h-3 inline" /> Remove</button>}
    </div>
  );

  if (printMode !== 'screen') {
    const deck = generateDeck();
    let cardsToPrint;
    
    if (printMode === 'double-sided') {
      // For double-sided printing, interleave fronts and backs
      cardsToPrint = deck;
    } else if (printMode === 'fronts') {
      cardsToPrint = deck;
    } else {
      cardsToPrint = getBacksForDoubleSided(deck);
    }
    
    const cardsPerPage = paperSize === 'A4' ? 8 : 16;
    const pages = [];
    for (let i = 0; i < cardsToPrint.length; i += cardsPerPage) pages.push(cardsToPrint.slice(i, i + cardsPerPage));

    return (
      <div className="print-content">
        {printMode === 'double-sided' ? (
          // Double-sided mode: fronts and backs on alternating pages
          pages.map((pageCards, pageIdx) => (
            <Fragment key={pageIdx}>
              {/* Front page */}
              <div className="print-page" style={{pageBreakAfter: 'always'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 57mm)', gridTemplateRows: `repeat(${paperSize === 'A4' ? 2 : 4}, 88.9mm)`, gap: 0, justifyContent: 'center', alignItems: 'center', minHeight: paperSize === 'A4' ? '297mm' : '420mm'}}>
                  {pageCards.map((card, idx) => (
                    <div key={card?.id || `empty-${idx}`} style={{width: '57mm', height: '88.9mm', position: 'relative', border: showCutLines ? '0.5px dashed #ccc' : 'none'}}>
                      {card && <CardFront card={card} />}
                    </div>
                  ))}
                </div>
              </div>
              {/* Back page - mirrored for proper alignment */}
              <div className="print-page" style={{pageBreakAfter: pageIdx < pages.length - 1 ? 'always' : 'auto'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 57mm)', gridTemplateRows: `repeat(${paperSize === 'A4' ? 2 : 4}, 88.9mm)`, gap: 0, justifyContent: 'center', alignItems: 'center', minHeight: paperSize === 'A4' ? '297mm' : '420mm'}}>
                  {(() => {
                    const cols = 4;
                    const rows = paperSize === 'A4' ? 2 : 4;
                    const flippedBacks = [];
                    for (let row = 0; row < rows; row++) {
                      for (let col = 0; col < cols; col++) {
                        const idx = row * cols + col;
                        if (idx < pageCards.length) {
                          flippedBacks[row * cols + (cols - 1 - col)] = pageCards[idx];
                        }
                      }
                    }
                    return flippedBacks.map((card, idx) => (
                      <div key={card?.id || `back-${idx}`} style={{width: '57mm', height: '88.9mm', position: 'relative', border: showCutLines ? '0.5px dashed #ccc' : 'none'}}>
                        {card && (
                          <div style={{position: 'relative', backgroundColor: 'white', border: '1px solid #9ca3af', borderRadius: '8px', overflow: 'hidden', width: '100%', height: '100%'}}>
                            <img src={cardBack} alt="Back" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </Fragment>
          ))
        ) : (
          // Single-sided mode
          pages.map((pageCards, pageIdx) => (
            <div key={pageIdx} className="print-page" style={{pageBreakAfter: pageIdx < pages.length - 1 ? 'always' : 'auto'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 57mm)', gridTemplateRows: `repeat(${paperSize === 'A4' ? 2 : 4}, 88.9mm)`, gap: 0, justifyContent: 'center', alignItems: 'center', minHeight: paperSize === 'A4' ? '297mm' : '420mm', paddingTop: '25.4mm'}}>
                {pageCards.map((card, idx) => (
                  <div key={card?.id || `empty-${idx}`} style={{width: '57mm', height: '88.9mm', position: 'relative', border: showCutLines ? '0.5px dashed #ccc' : 'none'}}>
                    {card && (printMode === 'fronts' ? <CardFront card={card} /> : 
                      <div style={{position: 'relative', backgroundColor: 'white', border: '1px solid #9ca3af', borderRadius: '8px', overflow: 'hidden', width: '100%', height: '100%'}}>
                        <img src={cardBack} alt="Back" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <style>{`@media print { body { margin: 0; } @page { margin: 25.4mm; size: ${paperSize} ${paperSize === 'A4' ? 'landscape' : 'portrait'}; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 print:hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">JdeM's Playing Card Design Tool</h1>
          <p className="text-gray-600">Design your complete deck of cards</p>
        </div>

        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex items-center gap-2">
            {['suits', 'numbers', cardStyle === 'playing' ? 'faces' : 'pictures', 'back', 'preview'].map((s, i) => {
              const displayName = s === 'pictures' ? 'Picture Cards' : s.charAt(0).toUpperCase() + s.slice(1);
              const isComplete = (s === 'suits' && allSuitsUploaded) || 
                                 (s === 'numbers' && allNumbersUploaded) || 
                                 (s === 'faces' && allFaceCardsUploaded) ||
                                 (s === 'pictures' && allPictureCardImagesUploaded) ||
                                 (s === 'back' && cardBackUploaded);
              return (
                <button key={s} onClick={() => setStep(s)}
                  className={`px-4 py-3 rounded-lg font-semibold transition text-sm ${step === s ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                  {i+1}. {displayName}
                  {isComplete ? <Check className="inline w-4 h-4 ml-1" /> : ''}
                </button>
              );
            })}
          </div>
        </div>

        {step === 'suits' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Step 1: Upload Your Suit Symbols</h2>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {suitNames.map(suit => (
                <UploadBox key={suit} value={[setSuits, suit]} onUpload={handleFileUpload((data) => setSuits(prev => ({...prev, [suit]: data})))} image={suits[suit]} label={suit} />
              ))}
            </div>
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Corner Style</h3>
              <div className="flex gap-4">
                {['two', 'four'].map(style => (
                  <button key={style} onClick={() => setCornerStyle(style)}
                    className={`flex-1 p-6 border-4 rounded-lg transition ${cornerStyle === style ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                    <div className="text-2xl font-bold mb-2">{style === 'two' ? 'Two' : 'Four'} Corners</div>
                    <p className="text-sm text-gray-600">{style === 'two' ? 'Top-left and bottom-right' : 'All four corners'}</p>
                  </button>
                ))}
              </div>
            </div>
            {allSuitsUploaded && (
              <div className="mt-8 text-center">
                <button onClick={() => setStep('numbers')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg">Next: Upload Numbers →</button>
              </div>
            )}
          </div>
        )}

        {step === 'numbers' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Step 2: Upload Numbers and Letters</h2>
            <p className="text-gray-600 mb-6">Upload your custom designs for A, 2-10, J, Q, K. Design your own font!</p>
            
            <div className="mb-8 border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Card Style</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setCardStyle('playing')}
                  className={`flex-1 p-6 border-4 rounded-lg transition ${
                    cardStyle === 'playing' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                  }`}
                >
                  <div className="text-xl font-bold mb-2">Traditional Playing Cards</div>
                  <p className="text-sm text-gray-600">Suit symbols arranged in the middle of number cards. Unique artwork for J, Q, K face cards.</p>
                </button>
                <button
                  onClick={() => setCardStyle('picture')}
                  className={`flex-1 p-6 border-4 rounded-lg transition ${
                    cardStyle === 'picture' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                  }`}
                >
                  <div className="text-xl font-bold mb-2">Picture Cards</div>
                  <p className="text-sm text-gray-600">Upload 13 unique images (one per value) that fill the card. Same image across all suits.</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {allValues.map(value => (
                <UploadBox key={value} value={[setNumbers, value]} onUpload={handleFileUpload((data) => setNumbers(prev => ({...prev, [value]: data})))} image={numbers[value]} label={value} />
              ))}
            </div>
            {allNumbersUploaded && (
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setStep(cardStyle === 'playing' ? 'faces' : 'pictures')} 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg"
                >
                  Next: {cardStyle === 'playing' ? 'Face Cards' : 'Picture Cards'} →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'pictures' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Step 3: Upload Picture Card Images</h2>
            <p className="text-gray-600 mb-8">Upload 13 unique images - one for each card value. Each image will appear on all 4 suits with corner symbols to differentiate them.</p>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-6">
              {allValues.map(value => (
                <div key={value} className="flex flex-col items-center">
                  <label className="w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFileUpload((data) => setPictureCardImages(prev => ({...prev, [value]: data})))(e.target.files[0])}
                      className="hidden"
                    />
                    <div
                      className={`border-4 rounded-lg p-4 text-center transition aspect-[2.25/3.5] flex items-center justify-center ${
                        pictureCardImages[value] ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                      onPaste={(e) => handlePaste(e, setPictureCardImages, value)}
                      onDrop={(e) => handleDrop(e, setPictureCardImages, value)}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      tabIndex={0}
                    >
                      {pictureCardImages[value] ? (
                        <img src={pictureCardImages[value]} alt={value} className="w-full h-full object-cover rounded" />
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Click, paste, or drag</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <p className="mt-2 font-bold text-gray-700">{value}</p>
                  {pictureCardImages[value] && (
                    <button
                      onClick={() => setPictureCardImages(prev => ({...prev, [value]: null}))}
                      className="mt-1 text-red-500 text-xs"
                    >
                      <Trash2 className="w-3 h-3 inline" /> Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            {allPictureCardImagesUploaded && (
              <div className="mt-8 text-center">
                <button onClick={() => setStep('back')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg">Next: Card Back →</button>
              </div>
            )}
          </div>
        )}

        {step === 'faces' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Step 3: Upload Face Cards</h2>
            <div className="space-y-8">
              {suitNames.map(suit => (
                <div key={suit}>
                  <h3 className="text-xl font-semibold mb-4 capitalize">{suit}</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {faceValues.map(value => {
                      const key = `${suit}-${value}`;
                      return <UploadBox key={key} value={[setFaceCards, key]} onUpload={handleFileUpload((data) => setFaceCards(prev => ({...prev, [key]: data})))} image={faceCards[key]} label={`${value} of ${suit}`} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
            {allFaceCardsUploaded && (
              <div className="mt-8 text-center">
                <button onClick={() => setStep('back')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg">Next: Card Back →</button>
              </div>
            )}
          </div>
        )}

        {step === 'back' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Step 4: Upload Card Back</h2>
            <div className="flex justify-center">
              <div className="w-64">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleFileUpload(setCardBack)(e.target.files[0])} className="hidden" />
                  <div className={`border-4 rounded-lg p-8 ${cardBack ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-purple-500'}`}
                    onPaste={(e) => handlePaste(e, setCardBack, null)}
                    onDrop={(e) => handleDrop(e, setCardBack, null)}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    tabIndex={0}>
                    {cardBack ? <img src={cardBack} alt="Back" className="w-full h-96 object-cover rounded" /> : 
                      <div className="h-96 flex flex-col items-center justify-center">
                        <Upload className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-lg text-gray-500">Upload Card Back</p>
                      </div>
                    }
                  </div>
                </label>
                {cardBack && <button onClick={() => setCardBack(null)} className="mt-4 text-red-500 text-sm"><Trash2 className="w-4 h-4 inline mr-1" /> Remove</button>}
              </div>
            </div>
            {cardBackUploaded && (
              <div className="mt-8 text-center">
                <button onClick={() => setStep('preview')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg">Preview Deck →</button>
              </div>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Print Settings</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Card Size</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCardSize('bridge')}
                      className={`flex-1 p-4 border-4 rounded-lg transition font-semibold ${
                        cardSize === 'bridge' 
                          ? 'border-purple-600 bg-purple-50 text-purple-700' 
                          : 'border-gray-300 hover:border-purple-400 text-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-1">Bridge</div>
                      <div className="text-xs">57 × 88.9mm</div>
                    </button>
                    <button
                      onClick={() => setCardSize('poker')}
                      className={`flex-1 p-4 border-4 rounded-lg transition font-semibold ${
                        cardSize === 'poker' 
                          ? 'border-purple-600 bg-purple-50 text-purple-700' 
                          : 'border-gray-300 hover:border-purple-400 text-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-1">Poker</div>
                      <div className="text-xs">63.5 × 88.9mm</div>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Paper Size</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setPaperSize('A4')}
                      className={`flex-1 p-4 border-4 rounded-lg transition font-semibold ${
                        paperSize === 'A4' 
                          ? 'border-purple-600 bg-purple-50 text-purple-700' 
                          : 'border-gray-300 hover:border-purple-400 text-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-1">A4</div>
                      <div className="text-xs">{cardSize === 'bridge' ? '8' : '6'} cards/page</div>
                    </button>
                    <button
                      onClick={() => setPaperSize('A3')}
                      className={`flex-1 p-4 border-4 rounded-lg transition font-semibold ${
                        paperSize === 'A3' 
                          ? 'border-purple-600 bg-purple-50 text-purple-700' 
                          : 'border-gray-300 hover:border-purple-400 text-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-1">A3</div>
                      <div className="text-xs">{cardSize === 'bridge' ? '16' : '12'} cards/page</div>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700">Cut Guides</label>
                  <label className="flex items-center gap-3 p-4 border-4 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      checked={showCutLines} 
                      onChange={(e) => setShowCutLines(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">Show corner cut marks</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Deck Preview (All 52 Cards)</h2>
                <button onClick={() => setShowBacks(!showBacks)} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg">
                  {showBacks ? 'Show Fronts' : 'Show Backs'}
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2">
                {generateDeck().map(card => (
                  <div key={card.id} className="relative" style={{aspectRatio: '2.25/3.5'}}>
                    {showBacks ? (
                      <div className="relative bg-white border border-gray-400 rounded-lg overflow-hidden w-full h-full" style={{borderWidth: '1px'}}>
                        <img src={cardBack} alt="Back" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <CardFront card={card} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Print Options</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <button onClick={() => handlePrintInNewWindow('double-sided')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-6 rounded-lg flex flex-col items-center gap-2">
                  <Printer className="w-8 h-8" />
                  <span className="text-lg">Double-Sided Print</span>
                  <span className="text-xs opacity-90">Automatic flip ({paperSize === 'A4' ? 'Short' : 'Long'} Edge)</span>
                </button>
                <button onClick={() => handlePrintInNewWindow('fronts')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-6 rounded-lg flex flex-col items-center gap-2">
                  <Printer className="w-8 h-8" />
                  <span className="text-lg">Print Fronts Only</span>
                  <span className="text-xs opacity-90">For manual double-sided</span>
                </button>
                <button onClick={() => handlePrintInNewWindow('backs')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-6 px-6 rounded-lg flex flex-col items-center gap-2">
                  <Printer className="w-8 h-8" />
                  <span className="text-lg">Print Backs Only</span>
                  <span className="text-xs opacity-90">For manual double-sided</span>
                </button>
                <button onClick={exportAsSVG} className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-6 rounded-lg flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 transform rotate-180" />
                  <span className="text-lg">Export as SVG</span>
                  <span className="text-xs opacity-90">Edit in Inkscape/online</span>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">📋 Printing Instructions</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">✅ Option 1: Double-Sided Print (Automatic - Recommended)</h4>
                <ol className="list-decimal ml-6 space-y-1 text-sm">
                  <li>Click "Double-Sided Print" button above</li>
                  <li>In your print dialog, select "Two-sided" or "Duplex printing"</li>
                  <li><strong className="text-red-600">IMPORTANT: Choose flip on {paperSize === 'A4' ? 'SHORT edge' : 'LONG edge'}</strong></li>
                  <li>Click Print - fronts and backs will automatically align!</li>
                  <li>Cut along dotted lines (if enabled)</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Option 2: Manual Double-Sided Print</h4>
                <ol className="list-decimal ml-6 space-y-1 text-sm">
                  <li>Click "Print Fronts Only" and print all pages</li>
                  <li>Take the printed pages and reload them into your printer</li>
                  <li><strong className="text-red-600">Flip the stack on {paperSize === 'A4' ? 'SHORT' : 'LONG'} edge</strong></li>
                  <li>Click "Print Backs Only" to print on the reverse side</li>
                  <li>Cut along dotted lines (if enabled)</li>
                </ol>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                <p className="text-sm"><strong>💡 Tip:</strong> {paperSize === 'A4' ? 'A4 is landscape orientation - cards flip on the short edge (top to bottom)' : 'A3 is portrait orientation - cards flip on the long edge (left to right)'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}