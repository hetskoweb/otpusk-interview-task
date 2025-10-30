import type { GeoEntity } from '../../types/GeoGentity';
import type { Tour } from '../../types/Tour';
import { TourCard } from '../TourCard';

type Props = {
  tours: Tour[];
  countries: Record<string, GeoEntity>;
};

export const ToursList: React.FC<Props> = ({ countries, tours }) => {
  return (
    <div className="tours__list">
      {tours.map((tour) => (
        <TourCard key={tour.id} countries={countries} tour={tour} />
      ))}
    </div>
  );
};
