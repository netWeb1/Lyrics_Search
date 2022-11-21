import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [lyrics, setLyrics] = useState('');
  const check = document.querySelector('.check');

  const onSubmitHandler = (e) => {
    e.preventDefault();

    let body = {
      lyrics: lyrics,
    };

    const request = axios
      .post('/api/lyrics', body)
      .then((response) => response.data); // 노래정보, 가사 등 포함 ( json형식으로 받아옴)

    check.innerHTML = body.lyrics;
  };

  const onSearchHandler = (e) => {
    setLyrics(e.target.value);
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input type='text' value={lyrics} onChange={onSearchHandler} />
        <button>search</button>
      </form>
      <p className='check'></p>
    </div>
  );
}

export default Search;
