import "server-only";
import { createPublicRecruitmentRepository, type PublicRecruitmentClient } from "../repositories/public-recruitments";
import { createClient } from "./server";

// Server-only entry point. Pages remain mock-backed until a separately approved cutover.
export async function getPublicRecruitmentRepository() {
  const client = await createClient();
  return createPublicRecruitmentRepository(client as unknown as PublicRecruitmentClient);
}
