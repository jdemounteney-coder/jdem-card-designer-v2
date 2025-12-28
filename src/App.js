import React, { useState } from 'react';
import { Upload, Printer, Trash2, Check } from 'lucide-react';

export default function PlayingCardDesigner() {
  const [suits, setSuits] = useState({
    hearts: null,
    diamonds: null,
    clubs: null,
    spades: null
  });
  const [numbers, setNumbers] = useState({
    A: null, '2': null, '3': null, '4': null, '5': null, '6': null,
    '7': null, '8': null, '9': null, '10': null, J: null, Q: null, K: null
  });
  const [faceCards, setFaceCards] = useState({
    'hearts-J': null, 'hearts-Q': null, 'hearts-K': null,
    'diamonds-J': null, 'diamonds-Q': null, 'diamonds-K': null,
    'clubs-J': null, 'clubs-Q': null, 'clubs-K': null,
    'spades-J': null, 'spades-Q': null, 'spades-K': null
  });
  const [cardBack, setCardBack] = useState(null);
  const [cornerStyle, setCornerStyle] = useState('two');
  const [step, setStep] = useState('suits');
  const [showBacks, setShowBacks] = useState(false);

  const suitNames = ['hearts', 'diamonds', 'clubs', 'spades'];
  const numberValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const faceValues = ['J', 'Q', 'K'];
  const allValues = [...numberValues, ...faceValues];

  const handleSuitUpload = (suitName, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSuits(prev => ({ ...prev, [suitName]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleNumberUpload = (value, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setNumbers(prev => ({ ...prev, [value]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFaceCardUpload = (suit, value, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFaceCards(prev => ({ ...prev, [`${suit}-${value}`]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCardBackUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCardBack(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e, callback) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          callback(file);
          return;
        }
      }
    }
  };

  const handleDrop = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check for files first
    const files = e.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type.indexOf('image') !== -1) {
      callback(files[0]);
      return;
    }
    
    // Check for image data in dataTransfer items
    const items = e.dataTransfer?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            callback(file);
            return;
          }
        }
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const allSuitsUploaded = Object.values(suits).every(s => s !== null);
  const allNumbersUploaded = Object.values(numbers).every(n => n !== null);
  const allFaceCardsUploaded = Object.values(faceCards).every(f => f !== null);
  const cardBackUploaded = cardBack !== null;

  const getPipPositions = (value) => {
    const positions = {
      'A': [[50, 50]],
      '2': [[50, 25], [50, 75]],
      '3': [[50, 25], [50, 50], [50, 75]],
      '4': [[30, 30], [70, 30], [30, 70], [70, 70]],
      '5': [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
      '6': [[30, 25], [70, 25], [30, 50], [70, 50], [30, 75], [70, 75]],
      '7': [[30, 25], [70, 25], [30, 50], [50, 38], [70, 50], [30, 75], [70, 75]],
      '8': [[30, 20], [70, 20], [30, 40], [70, 40], [30, 60], [70, 60], [30, 80], [70, 80]],
      '9': [[30, 20], [70, 20], [30, 40], [70, 40], [50, 50], [30, 60], [70, 60], [30, 80], [70, 80]],
      '10': [[30, 18], [70, 18], [30, 35], [70, 35], [50, 28], [50, 72], [30, 65], [70, 65], [30, 82], [70, 82]]
    };
    return positions[value] || [];
  };

  const generateDeck = () => {
    const deck = [];
    suitNames.forEach(suit => {
      allValues.forEach(value => {
        const isFace = faceValues.includes(value);
        deck.push({ suit, value, id: `${suit}-${value}`, type: isFace ? 'face' : 'number' });
      });
    });
    return deck;
  };

  const handlePrint = () => {
    window.print();
  };

  const CornerSymbol = ({ value, suit, rotated = false }) => (
    <div className={`flex flex-col items-center ${rotated ? 'transform rotate-180' : ''}`}>
      <img 
        src={numbers[value]} 
        alt={value}
        className="w-6 h-6 object-contain mb-1"
      />
      <img 
        src={suits[suit]} 
        alt={suit}
        className="w-4 h-4 object-contain"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 print:hidden">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">JdeM's Playing Card Design Tool</h1>
          <p className="text-gray-600">Design your complete deck of cards</p>
        </div>

        <div className="flex justify-center mb-8 print:hidden overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setStep('suits')}
              className={`px-3 sm:px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                step === 'suits'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              1. Suits {allSuitsUploaded && <Check className="inline w-4 h-4 ml-1" />}
            </button>
            <button
              onClick={() => setStep('numbers')}
              className={`px-3 sm:px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                step === 'numbers'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              2. Numbers {allNumbersUploaded && <Check className="inline w-4 h-4 ml-1" />}
            </button>
            <button
              onClick={() => setStep('faces')}
              className={`px-3 sm:px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                step === 'faces'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              3. Face Cards {allFaceCardsUploaded && <Check className="inline w-4 h-4 ml-1" />}
            </button>
            <button
              onClick={() => setStep('back')}
              className={`px-3 sm:px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                step === 'back'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              4. Card Back {cardBackUploaded && <Check className="inline w-4 h-4 ml-1" />}
            </button>
            <button
              onClick={() => setStep('preview')}
              disabled={!allSuitsUploaded || !allNumbersUploaded || !allFaceCardsUploaded || !cardBackUploaded}
              className={`px-3 sm:px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                step === 'preview'
                  ? 'bg-purple-600 text-white'
                  : allSuitsUploaded && allNumbersUploaded && allFaceCardsUploaded && cardBackUploaded
                  ? 'bg-white text-gray-600 hover:bg-gray-100'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              5. Preview
            </button>
          </div>
        </div>

        {step === 'suits' && (
          <div className="bg-white rounded-xl shadow-lg p-8 print:hidden">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Step 1: Upload Your Suit Symbols</h2>
            <p className="text-gray-600 mb-8">Upload your custom designs for each suit symbol. These will appear on all your cards.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {suitNames.map(suit => (
                <div key={suit} className="flex flex-col items-center">
                  <label className="w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleSuitUpload(suit, e.target.files[0])}
                      className="hidden"
                    />
                    <div 
                      className={`border-4 rounded-lg p-6 text-center transition ${
                        suits[suit]
                          ? 'border-green-500 bg-green-50'
                          : 'border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                      onPaste={(e) => handlePaste(e, (file) => handleSuitUpload(suit, file))}
                      onDrop={(e) => handleDrop(e, (file) => handleSuitUpload(suit, file))}
                      onDragOver={handleDragOver}
                      tabIndex={0}
                    >
                      {suits[suit] ? (
                        <img src={suits[suit]} alt={suit} className="w-24 h-24 mx-auto object-contain" />
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Click, paste, or drag</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <p className="mt-3 font-semibold text-gray-700 capitalize">{suit}</p>
                  {suits[suit] && (
                    <button
                      onClick={() => setSuits(prev => ({ ...prev, [suit]: null }))}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Corner Style</h3>
              <p className="text-gray-600 mb-4">Choose how many corners will display the number/letter and suit symbol:</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCornerStyle('two')}
                  className={`flex-1 p-6 border-4 rounded-lg transition ${
                    cornerStyle === 'two'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Two Corners</div>
                    <p className="text-sm text-gray-600">Top-left and bottom-right</p>
                  </div>
                </button>
                <button
                  onClick={() => setCornerStyle('four')}
                  className={`flex-1 p-6 border-4 rounded-lg transition ${
                    cornerStyle === 'four'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Four Corners</div>
                    <p className="text-sm text-gray-600">All four corners</p>
                  </div>
                </button>
              </div>
            </div>

            {allSuitsUploaded && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep('numbers')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Next: Upload Numbers →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'numbers' && (
          <div className="bg-white rounded-xl shadow-lg p-8 print:hidden">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Step 2: Upload Your Numbers and Letters</h2>
            <p className="text-gray-600 mb-8">Upload your custom designs for A, 2-10, J, Q, K. Design your own font!</p>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-4">
              {allValues.map(value => (
                <div key={value} className="flex flex-col items-center">
                  <label className="w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleNumberUpload(value, e.target.files[0])}
                      className="hidden"
                    />
                    <div 
                      className={`border-4 rounded-lg p-4 text-center transition aspect-square flex items-center justify-center ${
                        numbers[value]
                          ? 'border-green-500 bg-green-50'
                          : 'border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                      onPaste={(e) => handlePaste(e, (file) => handleNumberUpload(value, file))}
                      onDrop={(e) => handleDrop(e, (file) => handleNumberUpload(value, file))}
                      onDragOver={handleDragOver}
                      tabIndex={0}
                    >
                      {numbers[value] ? (
                        <img src={numbers[value]} alt={value} className="w-full h-full object-contain" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </label>
                  <p className="mt-2 font-bold text-gray-700">{value}</p>
                  {numbers[value] && (
                    <button
                      onClick={() => setNumbers(prev => ({ ...prev, [value]: null }))}
                      className="mt-1 text-red-500 hover:text-red-700 text-xs"
                    >
                      <Trash2 className="w-3 h-3 inline" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {allNumbersUploaded && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep('faces')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Next: Upload Face Cards →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'faces' && (
          <div className="bg-white rounded-xl shadow-lg p-8 print:hidden">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Step 3: Upload Your Face Cards</h2>
            <p className="text-gray-600 mb-8">Upload unique artwork for each Jack, Queen, and King in every suit (12 images total).</p>
            
            <div className="space-y-8">
              {suitNames.map(suit => (
                <div key={suit}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 capitalize">{suit}</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {faceValues.map(value => (
                      <div key={`${suit}-${value}`} className="flex flex-col items-center">
                        <label className="w-full cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleFaceCardUpload(suit, value, e.target.files[0])}
                            className="hidden"
                          />
                          <div 
                            className={`border-4 rounded-lg p-6 text-center transition ${
                              faceCards[`${suit}-${value}`]
                                ? 'border-green-500 bg-green-50'
                                : 'border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                            }`}
                            onPaste={(e) => handlePaste(e, (file) => handleFaceCardUpload(suit, value, file))}
                            onDrop={(e) => handleDrop(e, (file) => handleFaceCardUpload(suit, value, file))}
                            onDragOver={handleDragOver}
                            tabIndex={0}
                          >
                            {faceCards[`${suit}-${value}`] ? (
                              <img src={faceCards[`${suit}-${value}`]} alt={`${value} of ${suit}`} className="w-32 h-48 mx-auto object-contain" />
                            ) : (
                              <div className="w-32 h-48 flex flex-col items-center justify-center">
                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Upload {value}</p>
                                <p className="text-xs text-gray-400 mt-1">Click, paste, or drag</p>
                              </div>
                            )}
                          </div>
                        </label>
                        <p className="mt-3 font-semibold text-gray-700">{value} of {suit}</p>
                        {faceCards[`${suit}-${value}`] && (
                          <button
                            onClick={() => setFaceCards(prev => ({ ...prev, [`${suit}-${value}`]: null }))}
                            className="mt-2 text-red-500 hover:text-red-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {allFaceCardsUploaded && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep('back')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Next: Upload Card Back →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'back' && (
          <div className="bg-white rounded-xl shadow-lg p-8 print:hidden">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Step 4: Upload Card Back Design</h2>
            <p className="text-gray-600 mb-8">Upload one image that will be used as the back design for all cards.</p>
            
            <div className="flex justify-center">
              <div className="flex flex-col items-center w-full max-w-md">
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleCardBackUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <div 
                    className={`border-4 rounded-lg p-8 text-center transition ${
                      cardBack
                        ? 'border-green-500 bg-green-50'
                        : 'border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                    onPaste={(e) => handlePaste(e, handleCardBackUpload)}
                    onDrop={(e) => handleDrop(e, handleCardBackUpload)}
                    onDragOver={handleDragOver}
                    tabIndex={0}
                  >
                    {cardBack ? (
                      <img src={cardBack} alt="Card back" className="w-64 h-96 mx-auto object-cover rounded-lg" />
                    ) : (
                      <div className="w-64 h-96 flex flex-col items-center justify-center">
                        <Upload className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-lg text-gray-500">Upload Card Back</p>
                        <p className="text-sm text-gray-400 mt-2">Click, paste, or drag</p>
                      </div>
                    )}
                  </div>
                </label>
                {cardBack && (
                  <button
                    onClick={() => setCardBack(null)}
                    className="mt-4 text-red-500 hover:text-red-700 text-sm"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            {cardBackUploaded && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep('preview')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Preview Your Complete Deck →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div className="print:p-0">
            <div className="mb-6 flex justify-center gap-4 print:hidden">
              <button
                onClick={() => setShowBacks(!showBacks)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                {showBacks ? 'Show Card Fronts' : 'Show Card Backs'}
              </button>
              <button
                onClick={handlePrint}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition inline-flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print Complete Deck
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 print:shadow-none print:p-0">
              <h2 className="text-2xl font-bold mb-8 text-gray-800 print:hidden">Your Complete Deck</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 print:grid-cols-6 print:gap-2">
                {generateDeck().map(card => (
                  <div key={card.id} className="print:break-inside-avoid">
                    <div className="relative bg-white border-4 border-gray-800 rounded-lg overflow-hidden"
                         style={{ aspectRatio: '2.5/3.5' }}>
                      {showBacks ? (
                        <img src={cardBack} alt="Card back" className="w-full h-full object-cover" />
                      ) : card.type === 'number' ? (
                        <>
                          <div className="absolute top-2 left-2 z-10">
                            <CornerSymbol value={card.value} suit={card.suit} />
                          </div>

                          <div className="absolute bottom-2 right-2 z-10">
                            <CornerSymbol value={card.value} suit={card.suit} rotated={true} />
                          </div>

                          {cornerStyle === 'four' && (
                            <>
                              <div className="absolute top-2 right-2 z-10">
                                <CornerSymbol value={card.value} suit={card.suit} />
                              </div>
                              <div className="absolute bottom-2 left-2 z-10">
                                <CornerSymbol value={card.value} suit={card.suit} rotated={true} />
                              </div>
                            </>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                              {getPipPositions(card.value).map((pos, idx) => (
                                <div
                                  key={idx}
                                  className="absolute"
                                  style={{
                                    left: `${pos[0]}%`,
                                    top: `${pos[1]}%`,
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                >
                                  <img 
                                    src={suits[card.suit]} 
                                    alt={card.suit}
                                    className={`object-contain ${
                                      pos[1] > 50 ? 'transform rotate-180' : ''
                                    }`}
                                    style={{ 
                                      width: card.value === 'A' ? '80px' : '30px', 
                                      height: card.value === 'A' ? '80px' : '30px' 
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="absolute top-2 left-2 z-10">
                            <CornerSymbol value={card.value} suit={card.suit} />
                          </div>

                          <div className="absolute bottom-2 right-2 z-10">
                            <CornerSymbol value={card.value} suit={card.suit} rotated={true} />
                          </div>

                          {cornerStyle === 'four' && (
                            <>
                              <div className="absolute top-2 right-2 z-10">
                                <CornerSymbol value={card.value} suit={card.suit} />
                              </div>
                              <div className="absolute bottom-2 left-2 z-10">
                                <CornerSymbol value={card.value} suit={card.suit} rotated={true} />
                              </div>
                            </>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="w-full h-full border-2 border-gray-400 rounded-md overflow-hidden bg-white">
                              <img 
                                src={faceCards[`${card.suit}-${card.value}`]} 
                                alt={`${card.value} of ${card.suit}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body { margin: 0; }
          @page { margin: 0.5cm; size: landscape; }
        }
      `}</style>
    </div>
  );
}