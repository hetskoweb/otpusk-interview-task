import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// @ts-ignore
import { getPrice, getHotel } from '../../api/api.js';
import calendarIcon from '../../img/calendar-icon.svg';
import pinIcon from '../../img/pin-icon.svg';
import cityIcon from '../../img/city-icon.svg';
import './TourPage.scss';
import { Loader } from '../../components/Loader/Loader.js';
import { serviceIcons } from '../../constants/serviceIcons.ts';
import { serviceNames } from '../../constants/serviceNames.ts';

type PriceData = {
  id: string;
  amount: number;
  currency: 'usd';
  startDate: string;
  endDate: string;
  hotelID?: string;
};

type HotelData = {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
  description?: string;
  services?: Record<string, 'yes' | 'none'>;
};

export const TourPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const hotelId = location.state?.hotelId;

  const [price, setPrice] = useState<PriceData | null>(null);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getPrice(id)
      .then((res: Response) => res.json())
      .then((priceData: PriceData) => {
        setPrice(priceData);
        return getHotel(hotelId);
      })
      .then((res: Response) => res.json())
      .then((hotelData: HotelData) => setHotel(hotelData))
      .catch(() => setError('Не вдалося завантажити дані туру'))
      .finally(() => setLoading(false));
  }, [id]);

  console.log(price);
  console.log(hotel);

  return (
    <div className="tour-page">
      {loading && <Loader />}
      {typeof error === 'string' && (
        <div className="tour-page__error">{error}</div>
      )}
      {!loading && typeof error !== 'string' && (
        <div className="tour-card">
          <div className="tour-card__title">{hotel?.name}</div>
          <div className="tour-card__location">
            <div className="tour-card__location-country">
              <img src={pinIcon} alt="location-icon" />
              {hotel?.countryName}
            </div>
            <div className="tour-card__location-city">
              <img src={cityIcon} alt="city-icon" />
              {hotel?.cityName}
            </div>
          </div>
          <div className="tour-card__image">
            <img src={hotel?.img} alt="hotel-image" />
          </div>
          <div className="tour-card__description">
            <span className="tour-card__description-title">Опис</span>
            <span className="tour-card__description-text">
              {hotel?.description}
            </span>
          </div>
          <div className="tour-card__services">
            <span>Сервіси</span>
            <div className="tour-card__services-wrapper">
              {hotel?.services &&
                Object.entries(hotel.services)
                  .filter(([_, value]) => value === 'yes')
                  .map(([key], index) => (
                    <div key={index} className="tour-card__service">
                      {serviceIcons[key] && (
                        <img src={serviceIcons[key]} alt={key} />
                      )}
                      {serviceNames[key] || key.replace(/_/g, ' ')}
                    </div>
                  ))}
            </div>
          </div>
          <div className="tour-card__date">
            <img src={calendarIcon} alt="calendar-icon" />
            {price
              ? new Date(price.startDate).toLocaleDateString('uk-UA', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '—'}
          </div>
          <div className="tour-card__footer">
            <div className="tour-card__price">
              {price ? (
                <>
                  {new Intl.NumberFormat('uk-UA').format(price.amount)}{' '}
                  <span>{price.currency.toUpperCase()}</span>
                </>
              ) : (
                '—'
              )}
            </div>
            <a href="#" className="tour-card__btn">
              Відкрити ціну
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
