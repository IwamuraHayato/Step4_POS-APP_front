'use client';
import { useState } from 'react';

export default function Home() {
  const [itemCode, setItemCode] = useState('');
  const [postResult, setPostResult] = useState('');
  const [list, setList] = useState([]);

  const handlePostRequest = async () => {
    try{
      // const response = await fetch(`http://127.0.0.1:8000/api/read?itemCode=${itemCode}`, {
      const response = await fetch(`${process.env.API_ENDPOINT}/api/read?itemCode=${itemCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      });
    // console.log(`Request URL: http://127.0.0.1:8000/api/read?itemCode=${itemCode}`);
    const data = await response.json();
    // console.log('Response Data:', data); 
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
      // const response = await fetch(`http://127.0.0.1:8000/api/purchase`, {
      const response = await fetch(`${process.env.API_ENDPOINT}/api/purchase`, {
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
      // console.log('Response Data:', data); 
      alert(`購入が完了しました\n\n ${data[0][0]}円`);
      setList([]); //購入リストをクリア

    } catch (error) {
      console.error('Error:', error);
      alert('購入処理に失敗しました')
    }
  };
  
  return (
    <div className="flex flex-col items-center bg-gray-200 min-h-screen p-8">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-xl font-bold mb-4">商品コードを入力してください。</h1>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="number"
            value={itemCode}
            onChange={(e) => setItemCode(Number(e.target.value) || '')}
            className="border-2 border-gray-300 rounded px-4 py-2 flex-1"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handlePostRequest}
          >
            商品コード 読込
          </button>
        </div>
        <div className='bg-gray-100 h-20 mb-4'>
        {postResult && (
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <p className="font-bold">{postResult.NAME}</p>
            <p>{postResult.PRICE}円</p>
          </div>
        )}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={addList}
        >
          追加
        </button>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">購入リスト</h2>
          <div className="border-2 border-gray-300 rounded p-4 bg-gray-50 h-64">
            <ul className="space-y-2">
              {list.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.NAME} ×1</span>
                  <span>{item.PRICE}円</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full mt-4"
            onClick={handlePurchase}
          >
            購入
          </button>
        </div>
      </div>
    </div>
  );
}