import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import {
  getCountries,
  searchGeo,
  startSearchPrices,
  getSearchPrices,
  stopSearchPrices,
} from '../../api/api.js';
import './TourSearchForm.scss';
import { Loader } from '../Loader/Loader.js';
import closeIcon from '../../img/icon-close.svg';
import pinIcon from '../../img/pin-icon.svg';
import bedIcon from '../../img/bed-icon.svg';
import type { GeoEntity } from '../../types/GeoGentity.js';

type Props = {
  setTours: React.Dispatch<React.SetStateAction<any[]>>;
  setToursLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setToursError: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchToken: React.Dispatch<React.SetStateAction<string | null>>;
  onToursLoaded: (tours: any[], countryId: string | null) => void;
  setCountries: React.Dispatch<React.SetStateAction<Record<string, GeoEntity>>>;
};

export const TourSearchForm: React.FC<Props> = ({
  setCountries,
  setTours,
  setToursLoading,
  setToursError,
  setSearchToken,
  onToursLoaded,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<GeoEntity['type'] | null>(
    null,
  );
  const [dropdownItems, setDropdownItems] = useState<GeoEntity[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSearchToken = useRef<string | null>(null);
  const searchCancelled = useRef(false);
  const searchTimeout = useRef<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getCountries()
      .then((res: Response) => res.json())
      .then((data: Record<string, GeoEntity>) => {
        setCountries(data);
        setDropdownItems(
          Object.values(data).map((item) => ({ ...item, type: 'country' })),
        );
      })
      .catch((err: unknown) =>
        console.error('Помилка при завантаженні країн:', err),
      );
  }, []);

  const handleInputClick = () => {
    setShowDropdown(true);

    if (searchText === '') {
      loadCountries();
    }

    if (selectedType === 'country') {
      loadCountries();
    } else if (selectedType === 'city' || selectedType === 'hotel') {
      setLoading(true);
      searchGeo(searchText)
        .then((res: Response) => res.json())
        .then((data: Record<string, GeoEntity>) => {
          setDropdownItems(Object.values(data));
          setCountries(data);
        })
        .catch((err: unknown) => console.error('Помилка при пошуку:', err))
        .finally(() => setLoading(false));
    }
  };

  const loadCountries = () => {
    setLoading(true);
    getCountries()
      .then((res: Response) => res.json())
      .then((data: Record<string, GeoEntity>) => {
        setDropdownItems(
          Object.values(data).map((item) => ({ ...item, type: 'country' })),
        );
      })
      .catch((err: unknown) =>
        console.error('Помилка при завантаженні країн:', err),
      )
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setShowDropdown(true);
    setLoading(true);

    searchGeo(value)
      .then((res: Response) => res.json())
      .then((data: Record<string, GeoEntity>) => {
        setDropdownItems(Object.values(data));
      })
      .catch((err: unknown) => console.error('Помилка при пошуку:', err))
      .finally(() => setLoading(false));
  };

  const handleSelect = (item: GeoEntity) => {
    setSearchText(item.name);
    setSelectedType(item.type);
    setShowDropdown(false);

    if (item.type === 'country') {
      setSelectedCountryId(item.id);
    } else {
      setSelectedCountryId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchTours = (token: string, waitTime: number, retries = 2) => {
    const now = Date.now();
    const delay = waitTime > now ? waitTime - now : 0;

    searchTimeout.current = setTimeout(() => {
      if (searchCancelled.current) return;

      getSearchPrices(token)
        .then((res: Response) => res.json())
        .then(
          (data: {
            prices?: Record<string, any>;
            code?: number;
            waitUntil?: string;
            message?: string;
          }) => {
            if (searchCancelled.current) return;

            if (data.prices) {
              onToursLoaded(Object.values(data.prices), selectedCountryId);
              setToursLoading(false);
              setIsSearching(false);
            } else if (data.code === 425 && data.waitUntil) {
              fetchTours(token, new Date(data.waitUntil).getTime(), retries);
            } else {
              throw new Error(data.message || 'Unknown error');
            }
          },
        )
        .catch((err: unknown) => {
          if (searchCancelled.current) return;

          if (retries > 0) {
            fetchTours(token, Date.now(), retries - 1);
          } else {
            console.error('Помилка отримання турів:', err);
            setToursError(true);
            setToursLoading(false);
            setIsSearching(false);
          }
        });
    }, delay);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchText || selectedType !== 'country') return;

    setToursLoading(true);
    setTours([]);
    setToursError(false);
    setIsSearching(true);

    if (activeSearchToken.current) {
      searchCancelled.current = true;

      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      stopSearchPrices(activeSearchToken.current)
        .then((res: Response) => res.json())
        .then(() => {})
        .catch((err: unknown) => {
          console.error('Помилка при зупинці пошуку:', err);
        });
    }

    searchCancelled.current = false;

    startSearchPrices(selectedCountryId)
      .then((res: Response) => res.json())
      .then((data: { token: string; waitUntil: string }) => {
        activeSearchToken.current = data.token;
        setSearchToken(data.token);

        const waitTime = new Date(data.waitUntil).getTime();
        fetchTours(data.token, waitTime);
      })
      .catch((err: unknown) => {
        console.error('Помилка старту пошуку:', err);
        setToursError(true);
        setToursLoading(false);
        setIsSearching(false);
      });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__container" ref={containerRef}>
        <div className="form__title">Форма пошуку турів</div>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Виберіть напрямок"
            className="form__input"
            name="country"
            autoComplete="off"
            value={searchText}
            onClick={handleInputClick}
            onChange={handleInputChange}
          />
          {searchText.length > 0 && (
            <span
              className="close-icon"
              onClick={() => {
                setSearchText('');
              }}
            >
              <img src={closeIcon} alt="clear" />
            </span>
          )}
        </div>
        {showDropdown && (
          <ul className="form__dropdown">
            {loading && <Loader />}
            {!loading &&
              dropdownItems.map((item) => (
                <li
                  key={item.id}
                  className="dropdown-item"
                  onClick={() => handleSelect(item)}
                >
                  <span className="icon">
                    {item.type === 'country' && (
                      <img src={item.flag} alt={item.name} width={20} />
                    )}
                    {item.type === 'city' && (
                      <img src={pinIcon} alt={item.name} width={20} />
                    )}
                    {item.type === 'hotel' && (
                      <img src={bedIcon} alt={item.name} width={20} />
                    )}
                  </span>
                  {item.name}
                </li>
              ))}
          </ul>
        )}
      </div>
      <button type="submit" className="form__btn" disabled={isSearching}>
        Знайти
      </button>
    </form>
  );
};
