'use client';
import { useState } from 'react';

export default function Home() {
  const [itemCode, setItemCode] = useState('');
  const [postResult, setPostResult] = useState('');
  const [list, setList] = useState([]);

  const handlePostRequest = async () => {
    try{
      const response = await fetch(`http://127.0.0.1:8000/api/read?itemCode=${itemCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      });
    console.log(`Request URL: http://127.0.0.1:8000/api/read?itemCode=${itemCode}`);
    const data = await response.json();
    console.log('Response Data:', data); 
    setPostResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const addList = async () => {
    if(postResult){
      setList([...list, postResult]);
      setPostResult(null);
      setItemCode('');
    }
  }

  const handlePurchase = async () => {
    const totalAmount = list.reduce((sum, item) => sum + item.PRICE, 0);
    const confirmPurchase = confirm(`購入してもよろしいでしょうか？\n\n 合計金額：${totalAmount}円`);
  
    if (!confirmPurchase) {
      return; 
    }

    try{
      const response = await fetch(`http://127.0.0.1:8000/api/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: list,
        timestamp: new Date().toISOString(), //タイムスタンプ
        EMP_info:  {
          "EMP_CD": "9999999999",
          "STORE_CD": "30",
          "POS_NO": "90"
        },
        totalamt: totalAmount
      })
      });
      const data = await response.json();
      console.log('Response Data:', data); 
      alert('購入が完了しました');
      setList([]); //購入リストをクリア

    } catch (error) {
      console.error('Error:', error);
      alert('購入処理に失敗しました')
    }
  };
  
  return (
    <div className="p-8">
      <section>
        <h1>商品コードを入力してください。</h1>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={itemCode} 
            onChange={(e) => setItemCode(Number(e.target.value) ||'')} 
            className="border-2 border-indigo-600 rounded px-2 py-1"
          />
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded"
            onClick={handlePostRequest}>商品コード 読み込み
          </button>
        </div>
        {postResult && (
          <div className="mt-2">
            {postResult.error ? (
              <p>{postResult.error}</p>
            ) : (
              <div>
                <p>{postResult.NAME}</p>
                <p>{postResult.PRICE}円</p>
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* 購入リストへ追加 */}
      <section>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addList}>追加
        </button>
      </section>
      
      {/* 購入リスト */}
      <section>
        <h1>購入リスト</h1>
        <div className='border-2'>
          <ul>
            {list.map((item, index) => (
              <li key={index}>
                <p>{item.NAME} ×１ {item.PRICE}円　{item.PRICE}円</p>
              </li>
            ))}
          </ul>
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded"
          onClick= {handlePurchase}>購入
        </button>
      </section>
    </div>
  );
}
