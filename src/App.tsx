import { useState } from 'react';
import './App.scss'
import { TourSearchForm } from './components/TourSearchForm';
import { ToursResults } from './components/ToursResults';

function App() {
  const [tours, setTours] = useState<any[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [toursError, setToursError] = useState(false);
  const [searchToken, setSearchToken] = useState<string | null>(null);

  return (
    <div className="app">
      <TourSearchForm setTours={setTours} setToursLoading={setToursLoading} setToursError={setToursError} setSearchToken={setSearchToken} />
      <ToursResults tours={tours} loading={toursLoading} error={toursError} token={searchToken} />
    </div>
  )
}

export default App;
