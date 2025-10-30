import { useState } from 'react';
import './App.scss';
import { TourSearchForm } from './components/TourSearchForm';
import { ToursResults } from './components/ToursResults';
// @ts-ignore
import { getHotels } from './api/api.js';
import type { GeoEntity } from './types/GeoGentity.ts';
import { Route, Routes } from 'react-router-dom';
import { TourPage } from './modules/TourPage/TourPage.tsx';

interface Hotel {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
}

function App() {
  const [countries, setCountries] = useState<Record<string, GeoEntity>>({});
  const [tours, setTours] = useState<any[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [toursError, setToursError] = useState(false);
  const [searchToken, setSearchToken] = useState<string | null>(null);
  const [hotelsCache, setHotelsCache] = useState<Record<string, any[]>>({});

  const loadHotels = (countryId: string, callback: (hotels: any[]) => void) => {
    if (hotelsCache[countryId]) {
      callback(hotelsCache[countryId]);
      return;
    }

    getHotels(countryId)
      .then((res: Response) => res.json())
      .then((data: Record<string, Hotel>) => {
        const hotels = Object.values(data);
        setHotelsCache((prev) => ({ ...prev, [countryId]: hotels }));
        callback(hotels);
      })
      .catch((err: unknown) => {
        console.error('Помилка при завантаженні готелів:', err);
        callback([]);
      });
  };

  const handleToursLoaded = (newTours: any[], countryId: string | null) => {
    if (!countryId) {
      setTours(newTours);
      return;
    }

    loadHotels(countryId, (hotels) => {
      const merged = newTours.map((tour) => {
        return {
          ...tour,
          hotel: hotels.find((h) => h.id === Number(tour.hotelID)),
        };
      });

      setTours(merged);
    });
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TourSearchForm
                setCountries={setCountries}
                setTours={setTours}
                setToursLoading={setToursLoading}
                setToursError={setToursError}
                setSearchToken={setSearchToken}
                onToursLoaded={handleToursLoaded}
              />
              <ToursResults
                countries={countries}
                tours={tours}
                loading={toursLoading}
                error={toursError}
                token={searchToken}
              />
            </>
          }
        />
        <Route path="/tour/:id" element={<TourPage />} />
      </Routes>
    </div>
  );
}

export default App;
