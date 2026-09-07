import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../services/api';
import { getCategory } from '../utils/helpers';
import './catalog.css';

const PAGE_SIZE = 8;

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [price, setPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  const query = params.get('q') || '';
  const cat = params.get('cat') || '';

  const [cats, setCats] = useState([]);

  useEffect(() => { api.getCategories().then((c) => setCats([...c, { id: '', name: 'All categories' }])); }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const filters = { query, category: cat, sort };
    if (levels.length) filters.level = levels.length === 1 ? levels[0] : '';
    api.getCourses(filters).then((all) => {
      let list = all;
      if (levels.length === 1) { /* passed as filter */ }
      if (minRating) list = list.filter((c) => c.rating >= minRating);
      if (price === 'free') list = list.filter((c) => c.price === 0);
      if (price === 'paid') list = list.filter((c) => c.price > 0 && c.price <= (maxPrice || Infinity));
      else if (maxPrice) list = list.filter((c) => c.price <= maxPrice);
      setCourses(list);
      setLoading(false);
    });
  }, [query, cat, levels, minRating, price, maxPrice, sort]);

  const toggleLevel = (lvl) => {
    setLevels((lv) => (lv.includes(lvl) ? lv.filter((l) => l !== lvl) : [...lv, lvl]));
  };

  const hasFilters = query || cat || levels.length || minRating || price || maxPrice;

  const clearFilters = () => {
    setLevels([]); setMinRating(0); setPrice(''); setMaxPrice(0);
    setParams({});
  };

  const paged = courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(courses.length / PAGE_SIZE));

  return (
    <div className="page">
      <div className="mt-6 mb-4">
        <h1 className="text-2xl font-extrabold">
          {cat ? getCategory(cat)?.name : query ? `Results for "${query}"` : 'Browse all courses'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="catalog">
        <aside className="catalog__filters" aria-label="Course filters">
          <div className="catalog__filter">
            <h3>Category</h3>
            {cats.map((c) => (
              <label key={c.id} className="catalog__radio">
                <input type="radio" name="cat" checked={(cat || '') === (c.id || '')} onChange={() => setParams(c.id ? { ...Object.fromEntries(params), cat: c.id } : {})} />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
          <div className="catalog__filter">
            <h3>Level</h3>
            {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
              <label key={l} className="catalog__check">
                <input type="checkbox" checked={levels.includes(l)} onChange={() => toggleLevel(l)} />
                <span>{l}</span>
              </label>
            ))}
          </div>
          <div className="catalog__filter">
            <h3>Price</h3>
            <label className="catalog__radio">
              <input type="radio" name="price" checked={price === ''} onChange={() => setPrice('')} /><span>All</span>
            </label>
            <label className="catalog__radio">
              <input type="radio" name="price" checked={price === 'free'} onChange={() => setPrice('free')} /><span>Free</span>
            </label>
            <label className="catalog__radio">
              <input type="radio" name="price" checked={price === 'paid'} onChange={() => setPrice('paid')} /><span>Paid</span>
            </label>
          </div>
          <div className="catalog__filter">
            <h3>Max price</h3>
            <input type="range" min="0" max="200" step="10" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full" />
            <span className="text-xs text-slate-500">{maxPrice === 0 ? 'Any' : `Up to $${maxPrice}`}</span>
          </div>
          <div className="catalog__filter">
            <h3>Rating</h3>
            {[4.5, 4.0, 3.5].map((r) => (
              <label key={r} className="catalog__radio">
                <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} /><span>{r} & up</span>
              </label>
            ))}
          </div>
          {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all filters</Button>}
        </aside>

        <div className="catalog__main">
          <div className="catalog__toolbar">
            <span className="text-sm text-slate-500">{courses.length} results</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="catalog__sort" aria-label="Sort courses">
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to high</option>
            </select>
          </div>

          {loading ? (
            <div className="catalog__grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No courses found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={<Button onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <>
              <div className="catalog__grid">
                {paged.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
              {totalPages > 1 && (
                <div className="catalog__pagination">
                  <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                  <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                  <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}