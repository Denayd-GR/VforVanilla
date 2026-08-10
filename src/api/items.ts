import axios from "axios";
import { API_BASE_URL } from "../config/api";
import type { ItemDetail, ItemsQueryParams, ItemSummary, PaginatedResult } from "../types";

export async function fetchItems(
  params: ItemsQueryParams,
): Promise<PaginatedResult<ItemSummary>> {
  const { data } = await axios.get<PaginatedResult<ItemSummary>>(
    `${API_BASE_URL}/api/items`,
    { params },
  );
  return data;
}

export async function fetchItemDetail(entry: string | number): Promise<ItemDetail> {
  const { data } = await axios.get<ItemDetail>(`${API_BASE_URL}/api/items/${entry}`);
  return data;
}
