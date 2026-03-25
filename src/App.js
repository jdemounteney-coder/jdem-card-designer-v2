Carddesigner fixed · JSX
Copy

import React, { useState } from 'react';
import { Upload, Printer, Trash2, Check } from 'lucide-react';
 
export default function SimpleCardDesigner() {
  const [suits, setSuits] = useState({ hearts: null, diamonds: null, clubs: null, spades: null });
  const [numbers, setNumbers] = useState({
    A: null, '2': null, '3': null, '4': null, '5': null, '6': null,
    '7': null, '8': null, '9': null, '10': null, J: null, Q: null, K: null
  });
  const [faceCards, setFaceCards] = useState({
    'hearts-J': null, 'hearts-Q': null, 'hearts-K': null, 'diamonds-J': null, 'diamonds-Q': null, 'diamonds-K': null,
    'clubs-J': null, 'clubs-Q': null, 'clubs-K': null, 'spades-J': null, 'spades-Q': null, 'spades-K': null
  });
  const [pictureCards, setPictureCards] = useState({
    A: null, '2': null, '3': null, '4': null, '5': null, '6': null,
    '7': null, '8': null, '9': null, '10': null, J: null, Q: null, K: null
  });
  const [cardBack, setCardBack] = useState(null);
  const [cornerStyle, setCornerStyle] = useState('two');
  const [cardSize, setCardSize] = useState('bridge');
  const [cardStyle, setCardStyle] = useState('playing');
  const [showCutLines, setShowCutLines] = useState(true);
  const [step, setStep] = useState('suits');
  const [showBacks, setShowBacks] = useState(false);
 
  const suitNames = ['hearts', 'diamonds', 'clubs', 'spades'];
  const numberVals = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const faceVals = ['J', 'Q', 'K'];
  const allVals = [...numberVals, ...faceVals];
 
  const cardW = cardSize === 'bridge' ? 57 : 63.5;
  const cardH = 87;
  const perRow = cardSize === 'bridge' ? 4 : 3;
  const perPage = 12; // 3 rows × 4 (bridge) or 4 rows × 3 (poker)
  const rowsPerPage = perPage / perRow;
 
  const upload = (setter, key) => (file) => {
    const r = new FileReader();
    r.onload = (e) => setter(prev => key ? {...prev, [key]: e.target.result} : e.target.result);
    r.readAsDataURL(file);
  };
 
  const allDone = {
    suits: Object.values(suits).every(s => s),
    numbers: Object.values(numbers).every(n => n),
    faces: Object.values(faceCards).every(f => f),
    pictures: Object.values(pictureCards).every(p => p),
    back: !!cardBack
  };
 
  const pips = {
    'A': [[50,50]], '2': [[50,25],[50,75]], '3': [[50,25],[50,50],[50,75]],
    '4': [[30,30],[70,30],[30,70],[70,70]], '5': [[30,30],[70,30],[50,50],[30,70],[70,70]],
    '6': [[30,25],[70,25],[30,50],[70,50],[30,75],[70,75]],
    '7': [[30,25],[70,25],[30,50],[50,38],[70,50],[30,75],[70,75]],
    '8': [[30,20],[70,20],[30,40],[70,40],[30,60],[70,60],[30,80],[70,80]],
    '9': [[30,20],[70,20],[30,40],[70,40],[50,50],[30,60],[70,60],[30,80],[70,80]],
    '10': [[30,18],[70,18],[30,35],[70,35],[50,28],[50,72],[30,65],[70,65],[30,82],[70,82]]
  };
 
  const deck = () => {
    const d = [];
    suitNames.forEach(s => allVals.forEach(v => 
      d.push({ s, v, id: `${s}-${v}`, type: faceVals.includes(v) ? 'face' : 'num' })
    ));
    return d;
  };
 
  const Corner = ({ v, s, rot }) => (
    <div className={`flex flex-col items-center ${rot ? 'rotate-180' : ''}`} style={{
      background: 'white', 
      borderRadius: '4px', 
      padding: '2px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }}>
      <img src={numbers[v]} alt={v} style={{width: '7mm', height: '7mm', objectFit: 'contain'}} />
      <img src={suits[s]} alt={s} style={{width: '5mm', height: '5mm', objectFit: 'contain', marginTop: '1mm'}} />
    </div>
  );
 
  const Card = ({ c }) => (
    <div style={{position: 'relative', width: '100%', height: '100%', background: 'white', border: '1px solid #999', borderRadius: '3mm', overflow: 'hidden', boxSizing: 'border-box'}}>
      {cardStyle === 'picture' ? (
        <>
          <img src={pictureCards[c.v]} alt={c.v} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <div style={{position: 'absolute', top: '2mm', left: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} /></div>
          <div style={{position: 'absolute', bottom: '2mm', right: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} rot /></div>
          {cornerStyle === 'four' && (
            <>
              <div style={{position: 'absolute', top: '2mm', right: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} /></div>
              <div style={{position: 'absolute', bottom: '2mm', left: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} rot /></div>
            </>
          )}
        </>
      ) : c.type === 'num' ? (
        <>
          <div style={{position: 'absolute', top: '2mm', left: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} /></div>
          <div style={{position: 'absolute', bottom: '2mm', right: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} rot /></div>
          {cornerStyle === 'four' && (
            <>
              <div style={{position: 'absolute', top: '2mm', right: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} /></div>
              <div style={{position: 'absolute', bottom: '2mm', left: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} rot /></div>
            </>
          )}
          {(pips[c.v] || []).map((p, i) => (
            <div key={i} style={{position: 'absolute', left: `${p[0]}%`, top: `${p[1]}%`, transform: 'translate(-50%, -50%)'}}>
              <img src={suits[c.s]} alt="" className={p[1] > 50 ? 'rotate-180' : ''}
                style={{width: c.v === 'A' ? '80px' : '30px', height: c.v === 'A' ? '80px' : '30px', objectFit: 'contain'}} />
            </div>
          ))}
        </>
      ) : (
        <>
          <div style={{position: 'absolute', top: '2mm', left: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} /></div>
          <div style={{position: 'absolute', bottom: '2mm', right: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} rot /></div>
          {cornerStyle === 'four' && (
            <>
              <div style={{position: 'absolute', top: '2mm', right: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} /></div>
              <div style={{position: 'absolute', bottom: '2mm', left: '2mm', zIndex: 10}}><Corner v={c.v} s={c.s} rot /></div>
            </>
          )}
          <div style={{position: 'absolute', inset: '6mm', border: '2px solid #999', borderRadius: '2mm', overflow: 'hidden'}}>
            <img src={faceCards[`${c.s}-${c.v}`]} alt="" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
        </>
      )}
    </div>
  );
 
  const Marks = () => (
    <>
      {[
        {t: '-2px', l: '-2px', w: '3mm', h: '1px'}, {t: '-2px', l: '-2px', w: '1px', h: '3mm'},
        {t: '-2px', r: '-2px', w: '3mm', h: '1px'}, {t: '-2px', r: '-2px', w: '1px', h: '3mm'},
        {b: '-2px', l: '-2px', w: '3mm', h: '1px'}, {b: '-2px', l: '-2px', w: '1px', h: '3mm'},
        {b: '-2px', r: '-2px', w: '3mm', h: '1px'}, {b: '-2px', r: '-2px', w: '1px', h: '3mm'}
      ].map((s, i) => <div key={i} style={{position: 'absolute', background: '#999', ...s}} />)}
    </>
  );
 
  const UpBox = ({ img, onUp, label }) => (
    <div className="flex flex-col items-center">
      <label className="w-full cursor-pointer">
        <input type="file" accept="image/*,image/png" onChange={(e) => e.target.files[0] && onUp(e.target.files[0])} className="hidden" />
        <div className={`border-4 rounded-lg p-4 text-center transition ${img ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-purple-500'}`}>
          {img ? <img src={img} alt={label} className="w-24 h-24 mx-auto object-contain" /> : 
            <div><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-xs">Upload</p></div>}
        </div>
      </label>
      <p className="mt-2 font-semibold text-sm">{label}</p>
      {img && <button onClick={() => onUp(null)} className="mt-1 text-red-500 text-xs"><Trash2 className="w-3 h-3 inline" /> Remove</button>}
    </div>
  );
 
  // Shared grid style for both front and back print pages.
  // We rely solely on @page margins for positioning — no extra paddingTop here —
  // so fronts and backs sit at identical coordinates on their respective pages.
  // Explicit width + height + overflow:hidden guarantees no card bleeds past the page edge.
  // A3 printable width = 297mm - (2 * 25.4mm margins) = 246.2mm
  // When flipping on long edge, the back page is mirrored left-to-right.
  // So the back grid must be offset right by the unused page width,
  // so that after flipping it aligns exactly with the front grid.
  const printableW = 297 - 25.4 * 2; // 246.2mm
  const gridW = perRow * cardW;
  const backOffset = printableW - gridW; // bridge: 18.2mm, poker: 55.7mm
 
  const printGridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${perRow}, ${cardW}mm)`,
    gridTemplateRows: `repeat(${rowsPerPage}, ${cardH}mm)`,
    gap: 0,
    justifyContent: 'start',
    alignContent: 'start',
    width: `${gridW}mm`,
    height: `${rowsPerPage * cardH}mm`,
    overflow: 'hidden',
    marginTop: '10mm',
  };
 
  const backGridStyle = {
    ...printGridStyle,
    marginLeft: `${backOffset}mm`,
  };
 
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 print:hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 print:hidden">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">JdeM's Playing Card Design Tool</h1>
          <p className="text-gray-600">Design your deck of cards</p>
        </div>
 
        <div className="flex justify-center mb-8 gap-2 print:hidden">
          {['suits', 'numbers', cardStyle === 'playing' ? 'faces' : 'pictures', 'back', 'preview'].map((s, i) => (
            <button key={s} onClick={() => setStep(s)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${step === s ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}>
              {i+1}. {s === 'pictures' ? 'Pictures' : s.charAt(0).toUpperCase() + s.slice(1)}
              {(s === 'suits' && allDone.suits) || (s === 'numbers' && allDone.numbers) || 
               (s === 'faces' && allDone.faces) || (s === 'pictures' && allDone.pictures) || 
               (s === 'back' && allDone.back) ? <Check className="inline w-4 h-4 ml-1" /> : ''}
            </button>
          ))}
        </div>
 
        <div className="print:hidden">
          {step === 'suits' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Step 1: Suit Symbols</h2>
              <div className="grid grid-cols-4 gap-6 mb-8">
                {suitNames.map(s => <UpBox key={s} img={suits[s]} onUp={(f) => f ? upload(setSuits, s)(f) : setSuits(p => ({...p, [s]: null}))} label={s} />)}
              </div>
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Corner Style</h3>
                <div className="flex gap-4">
                  {['two', 'four'].map(st => (
                    <button key={st} onClick={() => setCornerStyle(st)}
                      className={`flex-1 p-4 border-4 rounded-lg ${cornerStyle === st ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                      <div className="text-xl font-bold">{st === 'two' ? 'Two' : 'Four'} Corners</div>
                    </button>
                  ))}
                </div>
              </div>
              {allDone.suits && <div className="mt-8 text-center"><button onClick={() => setStep('numbers')} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg">Next →</button></div>}
            </div>
          )}
 
          {step === 'numbers' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Step 2: Numbers & Letters</h2>
              <div className="mb-6">
                <div className="flex gap-4">
                  <button onClick={() => setCardStyle('playing')} className={`flex-1 p-4 border-4 rounded-lg ${cardStyle === 'playing' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                    <div className="font-bold">Traditional</div>
                    <p className="text-xs">Suit symbols + face cards</p>
                  </button>
                  <button onClick={() => setCardStyle('picture')} className={`flex-1 p-4 border-4 rounded-lg ${cardStyle === 'picture' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                    <div className="font-bold">Picture Cards</div>
                    <p className="text-xs">13 unique images</p>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {allVals.map(v => <UpBox key={v} img={numbers[v]} onUp={(f) => f ? upload(setNumbers, v)(f) : setNumbers(p => ({...p, [v]: null}))} label={v} />)}
              </div>
              {allDone.numbers && <div className="mt-8 text-center"><button onClick={() => setStep(cardStyle === 'playing' ? 'faces' : 'pictures')} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg">Next →</button></div>}
            </div>
          )}
 
          {step === 'pictures' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Step 3: Picture Card Images</h2>
              <p className="text-gray-600 mb-6">Upload 13 images. Each appears on all 4 suits. PNG with transparency supported!</p>
              <div className="grid grid-cols-7 gap-4">
                {allVals.map(v => <UpBox key={v} img={pictureCards[v]} onUp={(f) => f ? upload(setPictureCards, v)(f) : setPictureCards(p => ({...p, [v]: null}))} label={v} />)}
              </div>
              {allDone.pictures && <div className="mt-8 text-center"><button onClick={() => setStep('back')} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg">Next →</button></div>}
            </div>
          )}
 
          {step === 'faces' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Step 3: Face Cards</h2>
              <div className="space-y-6">
                {suitNames.map(s => (
                  <div key={s}>
                    <h3 className="text-lg font-semibold mb-3 capitalize">{s}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {faceVals.map(v => {
                        const k = `${s}-${v}`;
                        return <UpBox key={k} img={faceCards[k]} onUp={(f) => f ? upload(setFaceCards, k)(f) : setFaceCards(p => ({...p, [k]: null}))} label={`${v} of ${s}`} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {allDone.faces && <div className="mt-8 text-center"><button onClick={() => setStep('back')} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg">Next →</button></div>}
            </div>
          )}
 
          {step === 'back' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Step 4: Card Back</h2>
              <div className="flex justify-center">
                <UpBox img={cardBack} onUp={(f) => f ? upload(setCardBack)(f) : setCardBack(null)} label="Card Back" />
              </div>
              {allDone.back && <div className="mt-8 text-center"><button onClick={() => setStep('preview')} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg">Preview →</button></div>}
            </div>
          )}
 
          {step === 'preview' && (
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-3">Card Size</label>
                    <div className="flex gap-4">
                      {[['bridge', '57mm'], ['poker', '63.5mm']].map(([sz, dim]) => (
                        <button key={sz} onClick={() => setCardSize(sz)} className={`flex-1 p-4 border-4 rounded-lg ${cardSize === sz ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                          <div className="font-bold capitalize">{sz}</div>
                          <div className="text-xs">{dim} × 88.9mm</div>
                          <div className="text-xs opacity-75">{perPage}/page</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-3">Cut Marks</label>
                    <label className="flex items-center gap-3 p-4 border-4 border-gray-300 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={showCutLines} onChange={(e) => setShowCutLines(e.target.checked)} className="w-5 h-5" />
                      <span>Show corner marks</span>
                    </label>
                  </div>
                </div>
              </div>
 
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Preview</h2>
                  <button onClick={() => setShowBacks(!showBacks)} className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg">
                    {showBacks ? 'Show Fronts' : 'Show Backs'}
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2">
                  {deck().map(c => (
                    <div key={c.id} style={{aspectRatio: '2.25/3.5'}}>
                      {showBacks ? (
                        <div style={{width: '100%', height: '100%', background: 'white', border: '1px solid #999', borderRadius: '3mm', overflow: 'hidden'}}>
                          <img src={cardBack} alt="Back" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                      ) : <Card c={c} />}
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="text-center mb-6">
                <button onClick={() => window.print()} className="bg-purple-600 text-white font-bold py-4 px-8 rounded-lg inline-flex items-center gap-2">
                  <Printer className="w-6 h-6" /> Print Deck (A3 Double-Sided)
                </button>
              </div>
 
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">📋 Printing Instructions</h3>
                <ol className="list-decimal ml-6 space-y-2 text-sm">
                  <li>Click "Print Deck" button above</li>
                  <li>In print dialog, select <strong>"Two-sided"</strong> or <strong>"Duplex printing"</strong></li>
                  <li><strong className="text-red-600">IMPORTANT: Choose flip on LONG edge</strong></li>
                  <li>Paper size: <strong>A3 Portrait</strong></li>
                  <li>Click Print - fronts and backs will align perfectly!</li>
                  <li>Cut along corner marks (if enabled)</li>
                </ol>
              </div>
            </div>
          )}
        </div>
 
      </div>
    </div>
 
    {/* PRINT LAYOUT — outside all containers so no padding/margin affects positioning */}
    <div className="hidden print:block">
          {(() => {
            const d = deck();
            const pgs = [];
            for (let i = 0; i < d.length; i += perPage) pgs.push(d.slice(i, i + perPage));
            return pgs.map((pg, pi) => (
              <div key={pi} style={{padding: 0}}>
                {/* FRONT PAGE */}
                <div style={{...printGridStyle, pageBreakBefore: pi === 0 ? 'avoid' : 'always', pageBreakAfter: 'always', padding: 0}}>
                  {pg.map((c, i) => (
                    <div key={i} className="print-card-cell" style={{width: `${cardW}mm`, height: `${cardH}mm`, position: 'relative', boxSizing: 'border-box'}}>
                      <Card c={c} />
                      {showCutLines && <Marks />}
                    </div>
                  ))}
                </div>
 
                {/* BACK PAGE — columns mirrored so each back lines up with its front */}
                <div style={{...backGridStyle, pageBreakBefore: 'always', pageBreakAfter: pi < pgs.length - 1 ? 'always' : 'auto', padding: 0}}>
                  {(() => {
                    // Build a fully-populated array of perPage slots (null = empty).
                    // For each card in the page, place it in the mirror-column position
                    // of its row so it aligns with the front when printed double-sided.
                    const flipped = Array(perPage).fill(null);
                    const rows = perPage / perRow;
                    for (let row = 0; row < rows; row++) {
                      for (let col = 0; col < perRow; col++) {
                        const idx = row * perRow + col;
                        if (idx < pg.length) {
                          flipped[row * perRow + (perRow - 1 - col)] = pg[idx];
                        }
                      }
                    }
                    return flipped.map((c, i) => (
                      <div key={i} className="print-card-cell" style={{width: `${cardW}mm`, height: `${cardH}mm`, position: 'relative', boxSizing: 'border-box'}}>
                        {c && (
                          <div style={{width: '100%', height: '100%', background: 'white', border: '1px solid #999', borderRadius: '3mm', overflow: 'hidden', boxSizing: 'border-box'}}>
                            <img src={cardBack} alt="Back" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          </div>
                        )}
                        {c && showCutLines && <Marks />}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ));
          })()}
        </div>
 
        <style>{`
          @media print {
            body { margin: 0; padding: 0; }
            @page { margin: 25.4mm; size: A3 portrait; }
            * { box-sizing: border-box !important; padding: 0; }
            .print-card-cell {
              overflow: hidden !important;
              flex-shrink: 0 !important;
              margin: 0 !important;
            }
          }
        `}</style>
    </>
  );
}