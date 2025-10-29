import { Loader } from "../Loader";

type Props = {
  tours: any[];
  loading: boolean;
  error: boolean;
  token: string | null;
};

export const ToursResults: React.FC<Props> = ({ tours, loading, error, token }) => {

  return (
    <div className="tours">
      {loading && (
        <Loader />
      )}
      {error && (
        <div className="tours__error">Виникла помилка при завантаженні турів</div>
      )}
      {!loading && !error && tours.length === 0 && token && (
        <div className="tours__empty">За вашим запитом турів не знайдено</div>
      )}
    </div>
  );
};