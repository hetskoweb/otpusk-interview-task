import type { GeoEntity } from "../../types/GeoGentity";
import type { Tour } from "../../types/Tour";

type Props = {
  tour: Tour;
  countries: Record<string, GeoEntity>;
}

export const TourCard: React.FC<Props> = ({ countries, tour }) => {
  const countryFlag = countries[String(tour.hotel?.countryId)]?.flag;

  return (
    <div className="tours__item">
      <div className="tour">
        <div className="tour__image">
          <img src={tour.hotel?.img} alt={tour.hotel?.name} />
        </div>
        <div className="tour__title">
          {tour.hotel?.name}
        </div>
        <div className="tour__location">
          <div className="tour__location-icon">
            <img src={countryFlag} alt='country-flag' />
          </div>
          <div className="tour__location-country">{tour.hotel?.countryName},</div>
          <div className="tour__location-city">{tour.hotel?.cityName}</div>
        </div>
        <div className="tour__date">
          <span>Дата початку</span>
          {new Date(tour.startDate).toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })}
        </div>
        <div className="tour__price">{new Intl.NumberFormat("uk-UA").format(tour.amount)} <span>{tour.currency}</span></div>
        <a href="#" className="tour__btn">Відкрити ціну</a>
      </div>
    </div>
  );
};