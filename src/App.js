import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { DataService } from './services/DataService';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [queryParams, setQueryParams] = useState({})

  const getQueryParams = useCallback(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    params.co = params?.co?.split(',') || [];
    params.pos = params?.pos?.split(',') || [];
    setQueryParams(params);
  }, [])

  const getData = useCallback(async () => {
    const result = await DataService.getDataService();
    if (!result) {
      return;
    }

    setData(result);
  }, [])

  useEffect(() => {
    getQueryParams();
    getData();
  }, [])

  const titles = useMemo(() => {
    if(!queryParams.q) {
      return (data.map(el => el.title));
    }

    const filteredResult = data.reduce((acumm, currentVal) => {

      const isTitleMatch = currentVal.title.includes(queryParams.q);
      const isCompaniesMatch = queryParams?.co?.every(company => currentVal.companies.some(el => {
        return el.toLowerCase() === company.toLowerCase()
      }));
      const isPositionsMatch = queryParams?.pos?.every(position => currentVal.positions.some(el => {
        return el.toLowerCase() === position.toLowerCase()
      }));
      
      if (isTitleMatch && isCompaniesMatch && isPositionsMatch) {
        acumm.push(currentVal.title);
      }
      return acumm;
    }, [])
    return filteredResult;
  }, [data, queryParams]);

  const onResetClick = useCallback(() => {
    window.history.pushState('', '', window.origin)
    getQueryParams();
  }, [])
  
  return (
    <div className="app">
      <h1>questions</h1>
      <div className="query-container">
        {!!titles.length && queryParams.co.map(company => <div className="queries">{company}</div>)}
        {!!titles.length && queryParams.pos.map(position => <div className="queries">{position}</div>)}
        <div>
          <button onClick={onResetClick}>Reset</button>
        </div>
      </div>
      <div>
        {titles.map(title => <div className="title">{title}</div>)}
      </div>
    </div>
  );
}

export default App;
