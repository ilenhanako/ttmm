import { prisma } from "./db";

/**
 * Store an embedding vector for a meeting chunk.
 */
export async function storeChunkEmbedding(
  chunkId: string,
  embedding: number[]
): Promise<void> {
  const vectorString = `[${embedding.join(",")}]`;
  await prisma.$executeRaw`
    UPDATE meeting_chunks
    SET embedding = ${vectorString}::vector
    WHERE id = ${chunkId}
  `;
}

/**
 * Perform a cosine similarity search across meeting chunks.
 */
export async function findSimilarChunks(
  queryEmbedding: number[],
  limit: number = 5,
  meetingId?: string
): Promise<
  {
    id: string;
    meeting_id: string;
    content: string;
    chunk_index: number;
    page_numbers: number[];
    similarity: number;
  }[]
> {
  const vectorString = `[${queryEmbedding.join(",")}]`;

  if (meetingId) {
    return prisma.$queryRaw`
      SELECT
        id,
        meeting_id,
        content,
        chunk_index,
        page_numbers,
        1 - (embedding <=> ${vectorString}::vector) as similarity
      FROM meeting_chunks
      WHERE meeting_id = ${meetingId}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT ${limit}
    `;
  }

  return prisma.$queryRaw`
    SELECT
      id,
      meeting_id,
      content,
      chunk_index,
      page_numbers,
      1 - (embedding <=> ${vectorString}::vector) as similarity
    FROM meeting_chunks
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT ${limit}
  `;
}
