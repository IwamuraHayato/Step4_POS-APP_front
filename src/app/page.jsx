'use client';
import { useState } from 'react';

export default function Home() {
  const [itemCode, setItemCode] = useState('');
  const [postResult, setPostResult] = useState('');
  const handlePostRequest = async () => {
    try{
      const response = await fetch('http://127.0.0.1:8000/api/read', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemCode }),
      });
      const data = await response.json();
    setPostResult(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="p-8">
      <section>
        <h1>商品コードを入力してください。</h1>
        <div className="flex gap-2">
          <input 
          type="text" 
          value={itemCode} 
          onChange={(e) => setItemCode(e.target.value)} 
          className="border-2 border-indigo-600 rounded px-2 py-1"
          />
          <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handlePostRequest}>商品コード 読み込み
          </button>
        </div>
        {postResult && (
            <p className="mt-2"> {postResult}</p>
          )}
      </section>
      <section>

      </section>
    </div>
  );
}
