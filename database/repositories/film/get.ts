import { db } from '../../db'

export async function getFilms(category_id: number) {
  const query = db
    .selectFrom('film_category')
    .where('category_id', '=', category_id)
    .innerJoin('film', 'film.film_id', 'film_category.film_id')
    .select(['film.film_id', 'film.title', 'film.description', 'film.rental_rate'])

  return await query.execute()
}
