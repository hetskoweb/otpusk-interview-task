import type { GeoEntity } from '../../types/GeoGentity';
import { Loader } from '../Loader';
import { ToursList } from '../ToursList';
import './ToursResutls.scss';

type Props = {
  tours: any[];
  loading: boolean;
  error: boolean;
  token: string | null;
  countries: Record<string, GeoEntity>;
};

export const ToursResults: React.FC<Props> = ({
  countries,
  tours,
  loading,
  error,
  token,
}) => {
  return (
    <div className="tours">
      {loading && <Loader />}
      {error && (
        <div className="tours__error">
          Виникла помилка при завантаженні турів
        </div>
      )}
      {!loading && !error && tours.length === 0 && token && (
        <div className="tours__error">За вашим запитом турів не знайдено</div>
      )}
      {tours && <ToursList countries={countries} tours={tours} />}
    </div>
  );
};
