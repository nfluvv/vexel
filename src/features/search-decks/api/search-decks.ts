"use server"

import { searchPublicDecks } from "@/entities/deck/api/queries"

export async function searchPublicDecksAction(query: string, limit?: number) {
  return searchPublicDecks(query, limit)
}
