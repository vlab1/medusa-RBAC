import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { OnboardingState } from "../models";

const OnboardingRepository = dataSource.getRepository(OnboardingState);

export default OnboardingRepository;
