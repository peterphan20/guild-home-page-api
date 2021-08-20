const { createArticle, deleteArticle, updateArticles } = require('../../schemas/articlesSchemas')

module.exports = async function authArticlesRoutes(fastify) {
  fastify.requireAuthentication(fastify)

  fastify.post('/articles', { schema: createArticle }, async request => {
    const { title, content, imgURL, videoURL } = request.body
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      'INSERT INTO articles (title, content, img_url, video_url) VALUES ($1, $2, $3, $4)',
      [title, content, imgURL, videoURL]
    )
    client.release()
    return { code: 201, message: `Successfully created articles ${title}.`, rows }
  })

  fastify.delete('/articles/:id', { schema: deleteArticle }, async request => {
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query('DELETE FROM articles WHERE article_id=$1 RETURNING *;', [
      id,
    ])
    client.release()
    return { code: 200, message: `Successfully deleted articles with id ${id}.`, rows }
  })

  fastify.put('/articles/:id', { schema: updateArticles }, async request => {
    const { title, content, imgURL, videoURL } = request.body
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      'UPDATE articles SET title=$1, content=$2, img_url=$3, video_url=$4 WHERE article_id=$5 RETURNING *;',
      [title, content, imgURL, videoURL, id]
    )
    client.release()
    return { code: 200, message: `Sucessfully updated articles with id ${id}.`, rows }
  })
}
