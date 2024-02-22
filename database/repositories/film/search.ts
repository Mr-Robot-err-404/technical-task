import { db } from "../../db"

export async function searchFilms(title?: string, length?: number) {
    let query = db.selectFrom('film')

    if (title) {
        query = query.where('film.title', 'ilike', `%${title}%`)
    }

    if (length) {
        query = query.where('film.length', '<', length)
    }
    
    query = query.innerJoin('film_category', 'film.film_id', 'film_category.film_id')
            .innerJoin('category', 'film_category.category_id', 'category.category_id')
            .innerJoin('language', 'film.language_id', 'language.language_id')
            .select(['category.name', 'language.name', 'film.film_id', 'film.title', 'film.length', 'film.description', 'rental_rate'])

    return await query.execute()
}