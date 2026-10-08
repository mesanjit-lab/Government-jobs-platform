import "server-only";
import {
  composePublicRecruitmentCards,
  type PublicRecruitmentCardClient,
  type PublicRecruitmentCardOptions,
} from "../repositories/public-recruitment-cards";
import type { PublicRecruitmentSummary } from "../domain/recruitment";
import { createClient } from "./server";

// Server-only composition entry point. It deliberately does not load a base
// recruitment listing or make routes database-backed; callers retain control
// over bounded listing semantics and their own cache policy.
export async function getPublicRecruitmentCards(
  recruitments: readonly PublicRecruitmentSummary[],
  options: PublicRecruitmentCardOptions,
) {
  const client = await createClient();
  return composePublicRecruitmentCards(client as unknown as PublicRecruitmentCardClient, recruitments, options);
}
