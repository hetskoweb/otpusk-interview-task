import { useState, useEffect, useRef } from "react";
// @ts-ignore
import { getCountries, searchGeo } from "../../api/api.js"
import "./TourSearchForm.scss";
import { Loader } from "../Loader/Loader.js";
import closeIcon from '../../img/icon-close.svg';
import pinIcon from '../../img/pin-icon.svg';
import bedIcon from '../../img/bed-icon.svg';

interface GeoEntity {
  id: string;
  name: string;
  flag?: string;
  type: "country" | "city" | "hotel";
}

export default function TourSearchForm() {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<GeoEntity["type"] | null>(null);
  const [dropdownItems, setDropdownItems] = useState<GeoEntity[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputClick = () => {
    setShowDropdown(true);

    if (searchText === '') {
      loadCountries();
    }

    if (selectedType === "country") {
      loadCountries();
    } else if (selectedType === "city" || selectedType === "hotel") {
      setLoading(true);
      searchGeo(searchText)
        .then((res: Response) => res.json())
        .then((data: Record<string, GeoEntity>) =>
          setDropdownItems(Object.values(data))
        )
        .catch((err: unknown) => console.error("Помилка при пошуку:", err))
        .finally(() => setLoading(false));
    }
  };

  const loadCountries = () => {
    setLoading(true);
    getCountries()
      .then((res: Response) => res.json())
      .then((data: Record<string, GeoEntity>) => {
        setDropdownItems(Object.values(data).map(item => ({ ...item, type: "country" })));
      })
      .catch((err: unknown) => console.error("Помилка при завантаженні країн:", err))
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
      .catch((err: unknown) => console.error("Помилка при пошуку:", err))
      .finally(() => setLoading(false));
  };

  const handleSelect = (item: GeoEntity) => {
    setSearchText(item.name);
    setSelectedType(item.type);
    setShowDropdown(false);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form className="form">
      <div className="form__container" ref={containerRef}>
        <div className="form__title">Форма пошуку турів</div>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Виберіть напрямок"
            className="form__input"
            name='country'
            autoComplete="off"
            value={searchText}
            onClick={handleInputClick}
            onChange={handleInputChange}
          />
          {searchText.length > 0 && (
            <span className="close-icon" onClick={() => {
              setSearchText("");
            }}>
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
                    {item.type === "country" && (
                      <img src={item.flag} alt={item.name} width={20} />
                    )}
                    {item.type === "city" && (
                      <img src={pinIcon} alt={item.name} width={20} />
                    )}
                    {item.type === "hotel" && (
                      <img src={bedIcon} alt={item.name} width={20} />
                    )}
                  </span>
                  {item.name}
                </li>
              ))}
          </ul>
        )}
      </div>
      <button type="submit" className="form__btn">
        Знайти
      </button>
    </form>
  );
}